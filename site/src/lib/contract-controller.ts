import { changeImpact, deliveryCommitments, immediateEdges, relationLabels, statusScope, type ExplorerData } from './contract-model';
import { siteUrl } from './urls';

function element<K extends keyof HTMLElementTagNameMap>(tag: K, text = '') {
  const node = document.createElement(tag); node.textContent = text; return node;
}
export function initContractExplorers() {
  document.querySelectorAll<HTMLElement>('[data-contract-explorer]').forEach(root => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    const data = JSON.parse(root.querySelector('[data-ce-data]')!.textContent!) as ExplorerData;
    const records = new Map(data.records.map(record => [record.id, record]));
    const get = (id: string) => records.get(id)!;
    const recordSelect = root.querySelector<HTMLSelectElement>('[data-ce-record]')!;
    const summary = root.querySelector('[data-ce-summary]')!;
    let view = 'relationships';
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-ce-view]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[data-ce-panel]')];
    function item(id: string) {
      const record = get(id), button = element('button', `${id} · ${record.label}`);
      button.type = 'button'; button.className = 'ce-record-link'; button.setAttribute('aria-controls', 'ce-details');
      button.addEventListener('click', () => {
        select(id);
        const heading = root.querySelector<HTMLElement>('#ce-details-title')!;
        heading.tabIndex = -1; heading.focus();
      }); return button;
    }
    function select(id: string) {
      const record = get(id); recordSelect.value = id;
      const details = root.querySelector('[data-ce-details]')!;
      const title = element('p'); title.append(element('strong', `${id} · ${record.label}`));
      const type = element('p', `Record type: ${record.type}`);
      const status = element('p', `${statusScope(record)}: ${record.status.replaceAll('-', ' ')}`); status.className = 'ce-record-status'; status.dataset.status = record.status;
      const revision = element('p', `Revision: ${record.revision}`);
      const digest = element('p', `SHA-256: ${record.digest}`); digest.className = 'ce-digest';
      const source = element('a', `Read maintained Markdown: ${record.source}`); source.href = siteUrl(`files/${record.source}`);
      const github = element('p');
      if (record.revision !== 'Uncommitted working copy') {
        const link = element('a', 'Maintained source revision on GitHub');
        link.href = `https://github.com/And-Gu/document-as-code-lab/blob/${record.revision}/${record.source}`; github.append(link);
      } else github.textContent = 'GitHub source link will be available after this record is committed and published.';
      const note = element('p', record.revision === 'Uncommitted working copy' ? 'This source is a local working copy. Its GitHub path becomes available after publication.' : 'This snapshot uses the identified source revision. The GitHub main branch may later change.');
      const links = element('ul');
      for (const edge of immediateEdges(data, id)) {
        const row = element('li'); row.append(item(edge.source), document.createTextNode(` ${relationLabels[edge.type]} `), item(edge.target)); links.append(row);
      }
      if (!links.childElementCount) links.append(element('li', 'No recorded links.'));
      const readable = element('a', 'Read source record'); readable.href = siteUrl(`materials/${record.source.replace(/\.md$/, '')}/`);
      const provenance = element('details'); provenance.append(element('summary', 'Source and revision'), revision, digest, source, github, note);
      details.replaceChildren(title, type, status, element('p', record.body), readable, element('h5', 'Recorded links'), links, provenance);
      if (record.id === 'DEL-101') { const follow = element('a', 'Follow this delivery across sources'); follow.href = siteUrl('materials/reference/information-refinement/'); const paragraph = element('p'); paragraph.append(follow); readable.after(paragraph); }
      if (record.type === 'delivery') status.after(element('p', `Planned date: ${record.planned_date ?? 'Not recorded'}`));
      if (view === 'relationships') showRelationships(id);
      else summary.textContent = `Selected ${id} · ${record.label} · ${statusScope(record)}: ${record.status}`;
    }
    function showRelationships(id: string) {
      const edges = immediateEdges(data, id), body = root.querySelector('[data-ce-links]')!;
      const rows = edges.map(edge => {
        const row = element('tr'), from = element('td'), to = element('td');
        from.append(item(edge.source)); to.append(item(edge.target)); row.append(from, element('td', relationLabels[edge.type]), to); return row;
      });
      if (!rows.length) { const row = element('tr'), cell = element('td', 'No recorded links.'); cell.colSpan = 3; row.append(cell); rows.push(row); }
      body.replaceChildren(...rows);
      summary.textContent = `${edges.length} recorded links for ${id} · ${get(id).label}`;
      drawGraph(id, edges);
    }
    function drawGraph(id: string, edges: ExplorerData['edges']) {
      const graph = root.querySelector('[data-ce-graph]')!; graph.replaceChildren();
      const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', '0 0 720 420'); svg.setAttribute('aria-hidden', 'true');
      const neighbors = [...new Set(edges.map(edge => edge.source === id ? edge.target : edge.source))];
      const points = new Map([[id, { x: 360, y: 210 }]]);
      neighbors.forEach((neighbor, index) => {
        const angle = -Math.PI / 2 + index * 2 * Math.PI / neighbors.length;
        points.set(neighbor, { x: 360 + 235 * Math.cos(angle), y: 210 + 150 * Math.sin(angle) });
      });
      for (const edge of edges) {
        const from = points.get(edge.source)!, to = points.get(edge.target)!;
        const length = Math.hypot(to.x - from.x, to.y - from.y), dx = (to.x - from.x) / length, dy = (to.y - from.y) / length;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', String(from.x + dx * 65)); line.setAttribute('y1', String(from.y + dy * 35));
        const end = { x: to.x - dx * 76, y: to.y - dy * 43 };
        line.setAttribute('x2', String(end.x)); line.setAttribute('y2', String(end.y)); svg.append(line);
        const arrow = document.createElementNS(ns, 'polygon');
        arrow.setAttribute('points', `${end.x},${end.y} ${end.x - dx * 10 - dy * 4},${end.y - dy * 10 + dx * 4} ${end.x - dx * 10 + dy * 4},${end.y - dy * 10 - dx * 4}`); svg.append(arrow);
        const label = document.createElementNS(ns, 'text'); label.textContent = relationLabels[edge.type];
        label.setAttribute('x', String((from.x + to.x) / 2)); label.setAttribute('y', String((from.y + to.y) / 2 - 8)); label.setAttribute('text-anchor', 'middle'); svg.append(label);
      }
      graph.append(svg);
      for (const [nodeId, point] of points) {
        const button = item(nodeId); button.className = 'ce-node'; button.dataset.selected = String(nodeId === id);
        button.style.left = `${point.x / 720 * 100}%`; button.style.top = `${point.y / 420 * 100}%`;
        button.replaceChildren(element('strong', nodeId), element('span', get(nodeId).label)); graph.append(button);
      }
    }
    function showCommitments() {
      const project = root.querySelector<HTMLSelectElement>('[data-ce-project]')!.value;
      const agreement = root.querySelector<HTMLSelectElement>('[data-ce-agreement]')!.value;
      const rows = deliveryCommitments(data, project, agreement);
      const body = root.querySelector('[data-ce-deliveries]')!; body.replaceChildren();
      for (const row of rows) {
        const tr = element('tr'), delivery = element('td'); delivery.append(item(row.delivery.id), element('br'), item(row.project.id));
        const terms = element('td');
        for (const agreement of row.agreements) {
          const paragraph = element('div'); paragraph.className = 'ce-terms'; paragraph.append(item(agreement.id), element('br'), document.createTextNode(`Lifecycle: ${agreement.status}`));
          const disclosure = element('details'); disclosure.append(element('summary', 'Recorded terms'), element('p', agreement.body));
          paragraph.append(disclosure); terms.append(paragraph);
        }
        tr.append(delivery, element('td', row.delivery.planned_date ?? 'Not recorded'), element('td', row.delivery.status === 'not-recorded' ? 'Not recorded' : row.delivery.status), terms); body.append(tr);
      }
      root.querySelector<HTMLElement>('[data-ce-empty]')!.hidden = rows.length !== 0;
      summary.textContent = `${rows.length} deliveries · Agreement coverage follows recorded project links`;
    }
    function showImpact() {
      const id = root.querySelector<HTMLSelectElement>('[data-ce-change]')!.value, record = get(id);
      const impact = changeImpact(data, id);
      const message = record.type === 'amendment'
        ? record.status === 'proposed' ? `${id} is proposed, not effective. These links do not apply its terms.`
          : `${id} lifecycle status: ${record.status}. This does not establish delivery completion.`
        : `${id} lifecycle status: ${record.status}. Review candidates are not confirmed changes.`;
      root.querySelector('[data-ce-impact-status]')!.textContent = message;
      const direct = root.querySelector('[data-ce-direct]')!; direct.replaceChildren();
      for (const edge of impact.direct) { const row = element('li'); row.append(element('strong', 'Recorded: '), item(edge.source), document.createTextNode(` ${relationLabels[edge.type]} `), item(edge.target)); direct.append(row); }
      if (!impact.direct.length) direct.append(element('li', 'No directly recorded links.'));
      const candidates = root.querySelector('[data-ce-candidates]')!; candidates.replaceChildren();
      for (const candidate of impact.candidates) {
        const row = element('li'); row.className = 'ce-candidate'; row.append(element('strong', 'Review candidate: '), item(candidate.id));
        const trail = element('ul');
        for (const edge of candidate.path) trail.append(element('li', `${edge.source} ${relationLabels[edge.type]} ${edge.target} (recorded)`));
        row.append(element('p', 'Derived by following these recorded links, not a new asserted relationship:'), trail); candidates.append(row);
      }
      if (!impact.candidates.length) candidates.append(element('li', 'No further candidates found in the recorded relationships.'));
      select(id); summary.textContent = `${impact.direct.length} direct links · ${impact.candidates.length} traversal-derived review candidates`;
    }
    function switchView(next: string) {
      view = next;
      tabs.forEach(tab => { const active = tab.dataset.ceView === view; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
      panels.forEach(panel => { panel.hidden = panel.dataset.cePanel !== view; });
      if (view === 'relationships') select(recordSelect.value);
      if (view === 'commitments') showCommitments();
      if (view === 'impact') {
        const current = get(recordSelect.value);
        if (['agreement', 'amendment'].includes(current.type)) root.querySelector<HTMLSelectElement>('[data-ce-change]')!.value = current.id;
        showImpact();
      }
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => switchView(tab.dataset.ceView!));
      tab.addEventListener('keydown', event => {
        const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : undefined;
        if (next !== undefined) { event.preventDefault(); switchView(tabs[next].dataset.ceView!); tabs[next].focus(); }
      });
    });
    recordSelect.addEventListener('change', () => select(recordSelect.value));
    root.querySelector<HTMLButtonElement>('[data-ce-guide]')!.addEventListener('click', event => {
      const id = (event.currentTarget as HTMLButtonElement).dataset.ceGuide!;
      recordSelect.value = id;
      root.querySelector<HTMLSelectElement>('[data-ce-change]')!.value = id;
      switchView('impact');
      root.querySelector<HTMLButtonElement>('[data-ce-view="impact"]')!.focus();
    });
    for (const name of ['project', 'agreement']) root.querySelector(`[data-ce-${name}]`)!.addEventListener('change', showCommitments);
    root.querySelector('[data-ce-change]')!.addEventListener('change', showImpact);
    root.querySelector<HTMLElement>('[data-ce-fallback]')!.hidden = true;
    root.querySelectorAll<HTMLButtonElement | HTMLSelectElement>('button, select').forEach(control => { control.disabled = false; });
    const requested = new URLSearchParams(window.location.search).get('record');
    if (requested && records.has(requested)) recordSelect.value = requested;
    root.classList.add('ce-enhanced'); switchView('relationships');
  });
}
