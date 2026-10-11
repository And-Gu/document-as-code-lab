import Chart from 'chart.js/auto';
import { fetchMetrics, lagMessage, measures } from './metrics-api';
import type { Metrics, Metric } from './metrics-api';
import { failed } from './types';
import type { DataResult } from './types';
import { repositoryUrl } from './config';

export function startGrowth() {
  const root = document.querySelector<HTMLElement>('#dashboard-growth');
  if (!root) return;
  let result: DataResult<Metrics> = { state: 'Loading' }, latest: string | undefined;
  let controller: AbortController | undefined, timer: ReturnType<typeof setTimeout> | undefined, disposed = false, resumeRequested = false;
  let chart: Chart<'line', (number | null)[]> | undefined;
  const metric = root.querySelector<HTMLSelectElement>('[data-metric]')!;
  const from = root.querySelector<HTMLSelectElement>('[data-from]')!, to = root.querySelector<HTMLSelectElement>('[data-to]')!;
  const number = (value: number | null) => value === null ? 'Unknown' : value.toLocaleString('en-GB');
  function lag() { if (result.data) root!.querySelector('.dashboard-lag')!.textContent = lagMessage(result.data.source_commit, latest); }
  function update() {
    if (!result.data) return;
    const rows = result.data.history, field = metric.value as Metric;
    const start = Math.min(Number(from.value), Number(to.value)), end = Math.max(Number(from.value), Number(to.value));
    const selected = rows.slice(start, end + 1), label = measures.find(([key]) => key === field)![1];
    if (!chart) chart = new Chart<'line', (number | null)[]>(root!.querySelector('canvas')!, {
      type: 'line', data: { labels: [], datasets: [{ label, data: [], borderColor: '#17684c', pointRadius: 2, tension: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Commit order' } }, y: { beginAtZero: true, title: { display: true, text: label }, ticks: { precision: 0 } } } },
    });
    chart.data.labels = selected.map(row => row.source_commit.slice(0, 7));
    chart.data.datasets[0].data = selected.map(row => row[field]); chart.data.datasets[0].label = label;
    chart.options.scales!.y!.title = { display: true, text: label }; chart.update();
    const a = rows[start][field], b = rows[end][field], delta = a === null || b === null ? null : b - a;
    root!.querySelector('.dashboard-comparison')!.textContent = `${label}: ${number(a)} → ${number(b)} (${delta === null ? 'change unknown' : `${delta >= 0 ? '+' : ''}${number(delta)}`}) · ${rows[start].source_commit.slice(0, 7)} to ${rows[end].source_commit.slice(0, 7)}`;
  }
  function render() {
    const badge = root!.querySelector<HTMLElement>('.dashboard-state')!; badge.textContent = result.state; badge.dataset.state = result.state;
    root!.setAttribute('aria-busy', String(result.state === 'Loading'));
    root!.querySelector('.dashboard-error')!.textContent = result.error ?? '';
    if (!result.data) return;
    const data = result.data, provenance = root!.querySelector('.dashboard-provenance')!;
    const link = document.createElement('a'); link.href = `${repositoryUrl}/commit/${data.source_commit}`; link.textContent = data.source_commit.slice(0, 7);
    provenance.replaceChildren('Measured revision ', link, ` · Committed ${new Date(data.source_committed_at).toLocaleString()} · Generated ${new Date(data.generated_at).toLocaleString()} · Retrieved ${new Date(result.retrievedAt!).toLocaleString()} · Rules ${data.measurement_version} / Schema ${data.schema_version}`);
    const previousFrom = from.selectedOptions[0]?.dataset.sha, previousTo = to.selectedOptions[0]?.dataset.sha;
    for (const select of [from, to]) {
      select.replaceChildren(...data.history.map((row, index) => { const option = new Option(`${row.source_commit.slice(0, 7)} · ${row.committed_at.slice(0, 10)}`, String(index)); option.dataset.sha = row.source_commit; return option; })); select.disabled = false;
    }
    from.value = String(Math.max(0, data.history.findIndex(row => row.source_commit === previousFrom)));
    const index = data.history.findIndex(row => row.source_commit === previousTo); to.value = String(index < 0 ? data.history.length - 1 : index); metric.disabled = false;
    const tbody = root!.querySelector('tbody')!; tbody.replaceChildren();
    for (const row of data.history) {
      const tr = document.createElement('tr'), th = document.createElement('th'), a = document.createElement('a');
      th.scope = 'row'; a.href = `${repositoryUrl}/commit/${row.source_commit}`; a.textContent = `${row.source_commit.slice(0, 7)} · ${row.committed_at}`; th.append(a); tr.append(th);
      for (const [field] of measures) { const td = document.createElement('td'); td.textContent = number(row[field]); tr.append(td); } tbody.append(tr);
    }
    lag(); update();
  }
  async function refresh() {
    if (controller || disposed || document.hidden) return;
    clearTimeout(timer); controller = new AbortController(); const signal = controller.signal;
    const deadline = setTimeout(() => controller?.abort(new Error('Measurement refresh timed out.')), 30000);
    result = { ...result, state: 'Loading', error: undefined }; render();
    try { result = { data: await fetchMetrics(root!.dataset.url!, signal), state: 'Measured snapshot', retrievedAt: new Date().toISOString() }; }
    catch (error) { result = failed(result, signal.aborted ? (signal.reason instanceof Error && signal.reason.name !== 'AbortError' ? signal.reason.message : 'Measurement refresh paused.') : error instanceof Error ? error.message : 'Measurement unavailable'); }
    clearTimeout(deadline); controller = undefined; if (disposed) return;
    render(); if (resumeRequested) { resumeRequested = false; void refresh(); return; } if (!document.hidden) timer = setTimeout(refresh, 120000);
  }
  const main = (event: Event) => { latest = (event as CustomEvent<string>).detail; lag(); };
  const manual = () => void refresh();
  const visibility = () => { clearTimeout(timer); if (document.hidden) controller?.abort(); else if (controller) resumeRequested = true; else void refresh(); };
  const dispose = () => { disposed = true; clearTimeout(timer); controller?.abort(); chart?.destroy(); root.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); document.removeEventListener('dashboard:main', main); document.removeEventListener('dashboard:refresh', manual); };
  root.addEventListener('change', update);
  document.addEventListener('dashboard:main', main); document.addEventListener('dashboard:refresh', manual);
  document.addEventListener('visibilitychange', visibility); document.addEventListener('astro:before-swap', dispose, { once: true }); window.addEventListener('pagehide', () => { dispose(); window.addEventListener('pageshow', event => { if (event.persisted) startGrowth(); }, { once: true }); }, { once: true });
  void refresh();
}
