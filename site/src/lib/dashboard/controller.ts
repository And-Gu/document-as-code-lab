import { GitHubApi } from './github-api';
import { failed } from './types';
import type { Collection, DataResult, Item } from './types';

const keys = ['issues', 'pulls', 'commits', 'workflows'] as const;
type Key = typeof keys[number];
function timestamp(value: string): HTMLTimeElement {
  const time = document.createElement('time');
  time.dateTime = value;
  const date = new Date(value);
  time.textContent = Number.isNaN(date.valueOf()) ? 'Date unavailable' : date.toLocaleString();
  time.title = value;
  return time;
}
function itemElement(item: Item, prefix = ''): HTMLLIElement {
  const li = document.createElement('li'), link = document.createElement('a'), detail = document.createElement('div');
  link.href = item.url; link.textContent = `${prefix}${item.title}`;
  detail.className = 'dashboard-item-detail';
  if (item.state) { const badge = document.createElement('span'); badge.className = 'dashboard-state'; badge.dataset.state = item.state; badge.textContent = item.state; detail.append(badge, ` ${item.branch} · `); }
  else detail.append(`${item.id.length === 40 ? item.id.slice(0, 7) : '#' + item.id} · ${item.author} · `);
  if (item.date) detail.append(timestamp(item.date));
  for (const name of item.labels) { const label = document.createElement('span'); label.className = 'dashboard-label'; label.textContent = name; detail.append(label); }
  li.append(link, detail); return li;
}
export function startDashboard() {
  const root = document.querySelector<HTMLElement>('#control-center');
  if (!root) return;
  const api = new GitHubApi();
  const results: Record<Key, DataResult<Collection>> = { issues: { state: 'Loading' }, pulls: { state: 'Loading' }, commits: { state: 'Loading' }, workflows: { state: 'Loading' } };
  let controller: AbortController | undefined, timer: ReturnType<typeof setTimeout> | undefined, disposed = false, resumeRequested = false;
  const refreshButton = root.querySelector<HTMLButtonElement>('#dashboard-refresh')!;
  const announcement = root.querySelector<HTMLElement>('#dashboard-announcement')!;
  function render(key: Key) {
    const panel = root!.querySelector<HTMLElement>(`[data-widget="${key}"]`)!, result = results[key];
    const state = panel.querySelector<HTMLElement>('.dashboard-state')!;
    state.textContent = result.state; state.dataset.state = result.state;
    panel.setAttribute('aria-busy', String(result.state === 'Loading'));
    panel.querySelector('.dashboard-error')!.textContent = result.error ?? '';
    const time = panel.querySelector('.dashboard-time')!; time.replaceChildren();
    if (result.retrievedAt) time.append('Last successful retrieval: ', timestamp(result.retrievedAt));
    panel.querySelector('.dashboard-summary')!.textContent = result.data?.total === undefined ? '' : `${result.data.total} open`;
    panel.querySelector('.dashboard-scope')!.textContent = result.data?.scope ?? '';
    const query = panel.querySelector<HTMLInputElement>('input')?.value.toLowerCase() ?? '';
    const items = result.data?.items.filter(item => [item.title, item.author, ...item.labels].join(' ').toLowerCase().includes(query));
    const list = panel.querySelector('.dashboard-items')!; list.replaceChildren();
    if (items) {
      for (const item of key === 'workflows' ? items : items.slice(0, 10)) list.append(itemElement(item));
      if (!items.length) { const li = document.createElement('li'); li.textContent = query ? 'No matching items.' : 'No items returned.'; list.append(li); }
    }
  }
  function activity() {
    const filter = root!.querySelector<HTMLSelectElement>('#activity-filter')!.value;
    const items = keys.flatMap(key => filter !== 'all' && filter !== key ? [] : (results[key].data?.items ?? []).filter(item => item.date).map(item => ({ item, key })));
    items.sort((a, b) => Date.parse(b.item.date) - Date.parse(a.item.date));
    const list = root!.querySelector('#dashboard-activity ul')!; list.replaceChildren();
    for (const { item, key } of items.slice(0, 20)) list.append(itemElement(item, `${key} · ${results[key].state} · `));
    if (!items.length) { const li = document.createElement('li'); li.textContent = 'No activity available in the retrieved lists.'; list.append(li); }
  }
  async function refresh() {
    if (controller || disposed || document.hidden) return;
    clearTimeout(timer); controller = new AbortController(); const signal = controller.signal;
    const deadline = setTimeout(() => controller?.abort(new Error('GitHub refresh timed out. Retry to retrieve data.')), 45000);
    refreshButton.disabled = true; announcement.textContent = 'Refreshing repository data…';
    await Promise.allSettled(keys.map(async key => {
      results[key] = { ...results[key], state: 'Loading', error: undefined }; render(key);
      try {
        results[key] = { data: await api[key](signal), retrievedAt: new Date().toISOString(), state: 'Live API' };
        if (key === 'commits' && results[key].data?.items[0]) document.dispatchEvent(new CustomEvent('dashboard:main', { detail: results[key].data!.items[0].id }));
      }
      catch (error) { if (signal.aborted) { results[key] = failed(results[key], signal.reason instanceof Error && signal.reason.name !== 'AbortError' ? signal.reason.message : 'Refresh paused. Retry when visible.'); } else results[key] = failed(results[key], error instanceof Error ? error.message : 'Request unavailable'); }
      if (!disposed) { render(key); activity(); }
    }));
    clearTimeout(deadline); controller = undefined;
    if (disposed) return;
    refreshButton.disabled = false;
    if (resumeRequested) { resumeRequested = false; void refresh(); return; }
    const problems = keys.filter(key => ['Stale', 'Unavailable'].includes(results[key].state)).length;
    announcement.textContent = problems ? `${problems} data sources need attention. Last successful data is retained where available.` : 'Repository data refreshed.';
    if (!document.hidden) timer = setTimeout(refresh, api.pollingDelay());
  }
  const visibility = () => { clearTimeout(timer); if (document.hidden) controller?.abort(); else if (controller) resumeRequested = true; else void refresh(); };
  const manual = () => { document.dispatchEvent(new Event('dashboard:refresh')); void refresh(); };
  const input = () => { for (const key of keys) render(key); activity(); };
  const dispose = () => { disposed = true; clearTimeout(timer); controller?.abort(); document.removeEventListener('visibilitychange', visibility); root.removeEventListener('input', input); refreshButton.removeEventListener('click', manual); };
  document.addEventListener('visibilitychange', visibility);
  document.addEventListener('astro:before-swap', dispose, { once: true });
  window.addEventListener('pagehide', () => { dispose(); window.addEventListener('pageshow', event => { if (event.persisted) startDashboard(); }, { once: true }); }, { once: true });
  refreshButton.addEventListener('click', manual); root.addEventListener('input', input);
  void refresh();
}
