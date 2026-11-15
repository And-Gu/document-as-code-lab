import type { Concept, Connection } from './concept-map';
import type { ForceGraph3DInstance, NodeObject, LinkObject } from '3d-force-graph';
import type SpriteText from 'three-spritetext';

type MapNode = Concept & NodeObject & { fx: number; fy: number; fz: number };
interface MapData { nodes: Concept[]; links: Connection[]; groups: { id: number; title: string }[]; }

export async function initConceptMap() {
  const root = document.querySelector<HTMLElement>('[data-knowledge-map]');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const data = JSON.parse(root.querySelector('[data-map-data]')!.textContent!) as MapData;
  const canvas = root.querySelector<HTMLElement>('[data-map-canvas]')!;
  const search = root.querySelector<HTMLInputElement>('#concept-search')!;
  const results = root.querySelector<HTMLUListElement>('#concept-results')!;
  const filter = root.querySelector<HTMLSelectElement>('#concept-group')!;
  const panel = root.querySelector<HTMLElement>('[data-concept-detail]')!;
  const status = root.querySelector<HTMLElement>('[data-map-status]')!;
  const loading = root.querySelector<HTMLElement>('[data-map-loading]')!;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#456447', '#896113', '#705b87', '#386d74'];
  const labels = new Map<string, SpriteText>();
  const byId = new Map(data.nodes.map(node => [node.id, node]));
  let selected = byId.has(location.hash.slice(1)) ? location.hash.slice(1) : 'metadata';
  let dimensions: 2 | 3 = 3;
  let graph: ForceGraph3DInstance | undefined;
  let nodes: MapNode[] = [];
  let disposed = false;
  const duration = () => reducedMotion.matches ? 0 : 550;
  const endpoint = (node: LinkObject['source']) => typeof node === 'object' ? String(node.id) : String(node);
  const linked = (link: Connection) => link.source === selected || link.target === selected;
  const neighbours = () => new Set([selected, ...data.links.filter(linked).flatMap(link => [link.source, link.target])]);
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text: string) => {
    const element = document.createElement(tag); element.textContent = text; return element;
  };
  function conceptButton(id: string) {
    const button = make('button', byId.get(id)!.label);
    button.type = 'button';
    button.dataset.selectConcept = id;
    return button;
  }
  function describeSelection() {
    const concept = byId.get(selected)!;
    panel.querySelector('[data-concept-group]')!.textContent = data.groups[concept.group - 1].title;
    panel.querySelector('[data-concept-title]')!.textContent = concept.label;
    panel.querySelector('[data-concept-description]')!.textContent = concept.description;
    const connections = panel.querySelector('[data-concept-connections]')!;
    connections.replaceChildren();
    for (const link of data.links.filter(linked)) {
      const row = document.createElement('li');
      row.append(link.source === selected ? make('strong', concept.label) : conceptButton(link.source));
      row.append(document.createTextNode(` ${link.label} `));
      row.append(link.target === selected ? make('strong', concept.label) : conceptButton(link.target));
      connections.append(row);
    }
    const readings = panel.querySelector('[data-concept-reading]')!;
    readings.replaceChildren(...concept.reading.map(reading => {
      const row = document.createElement('li');
      const anchor = make('a', reading.title!); anchor.href = reading.href!;
      row.append(anchor); return row;
    }));
    panel.dataset.selected = selected;
    if (graph) status.textContent = `${concept.label} · ${data.links.filter(linked).length} connections highlighted`;
  }
  function styleSelection() {
    const near = neighbours();
    for (const [id, sprite] of labels) {
      const node = byId.get(id)!;
      sprite.color = id === selected ? '#173e2b' : colors[node.group - 1];
      sprite.backgroundColor = id === selected ? '#dce9d9' : '#f7f9f6';
      sprite.borderColor = id === selected ? '#526c4c' : '#f7f9f6';
      sprite.fontWeight = id === selected || near.has(id) ? '650' : '450';
    }
    graph?.linkColor(link => endpoint(link.source) === selected || endpoint(link.target) === selected ? '#55775d' : '#cad5cb');
    graph?.linkWidth(link => endpoint(link.source) === selected || endpoint(link.target) === selected ? .55 : .12);
    graph?.linkDirectionalArrowLength(link => endpoint(link.source) === selected || endpoint(link.target) === selected ? 2.6 : 0);
  }
  function select(id: string, focusPanel = false) {
    if (!byId.has(id)) return;
    selected = id;
    if (filter.value && Number(filter.value) !== byId.get(id)!.group) {
      filter.value = ''; populateGraph();
    }
    describeSelection(); styleSelection();
    if (focusPanel) panel.focus({ preventScroll: true });
  }
  function positions() {
    const counts = new Map<number, number>();
    // Stable positions preserve the reader's orientation between selections.
    // Depth separates labels when the reader turns the map.
    return data.nodes.filter(node => !filter.value || node.group === Number(filter.value)).map(node => {
      const index = counts.get(node.group) ?? 0; counts.set(node.group, index + 1);
      const centers = [[-112, 105], [112, 105], [-112, -105], [112, -105]];
      const [cx, cy] = centers[node.group - 1];
      const column = index % 2;
      const row = Math.floor(index / 2);
      const z = dimensions === 3 ? [-70, 65, 100, -45][(index + node.group) % 4] : 0;
      // Compensate for perspective in the opening view so nearby labels do not overlap.
      const scale = 1 - z / 500;
      const x = (cx + (column ? 52 : -52) + [-6, 4, 0, 8][index % 4]) * scale;
      const y = (cy + 70 - row * 38 + [0, 5, -3, 2][index % 4]) * scale;
      return { ...node, x, y, z, fx: x, fy: y, fz: z };
    });
  }
  function fit() {
    graph?.zoomToFit(duration(), 36);
  }
  function populateGraph() {
    if (!graph) return;
    nodes = positions();
    const ids = new Set(nodes.map(node => node.id));
    graph.graphData({ nodes, links: data.links.filter(link => ids.has(link.source) && ids.has(link.target)).map(link => ({ ...link })) });
    styleSelection();
    requestAnimationFrame(fit);
  }
  describeSelection();
  document.querySelector('.knowledge-page')?.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLElement>('[data-select-concept]');
    if (!button) return;
    select(button.dataset.selectConcept!, true);
    if (button.closest('.concept-directory')) root.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  });
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    results.replaceChildren();
    results.hidden = !query;
    if (!query) return;
    const matches = data.nodes.filter(node => node.label.toLocaleLowerCase().includes(query) || node.description.toLocaleLowerCase().includes(query));
    for (const node of matches.slice(0, 8)) {
      const row = document.createElement('li'); const button = conceptButton(node.id);
      button.addEventListener('click', () => { results.hidden = true; search.value = node.label; });
      row.append(button); results.append(row);
    }
    if (!matches.length) { const row = document.createElement('li'); row.append(make('span', 'No matching concepts. Try another term.')); results.append(row); }
  });
  search.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); results.querySelector('button')?.focus(); }
    if (event.key === 'Enter') { event.preventDefault(); results.querySelector('button')?.click(); }
    if (event.key === 'Escape') results.hidden = true;
  });
  results.addEventListener('keydown', event => {
    const buttons = [...results.querySelectorAll('button')];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'ArrowDown') { event.preventDefault(); buttons[(index + 1) % buttons.length]?.focus(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); if (index <= 0) search.focus(); else buttons[index - 1]?.focus(); }
    if (event.key === 'Escape') { results.hidden = true; search.focus(); }
  });
  document.addEventListener('pointerdown', event => {
    if (!(event.target as Element).closest('.concept-search')) results.hidden = true;
  });
  filter.addEventListener('change', () => {
    if (filter.value && byId.get(selected)!.group !== Number(filter.value)) selected = data.nodes.find(node => node.group === Number(filter.value))!.id;
    describeSelection(); populateGraph();
    status.textContent = `${filter.value ? data.nodes.filter(node => node.group === Number(filter.value)).length : data.nodes.length} concepts shown`;
  });
  root.querySelector('[data-map-reset]')!.addEventListener('click', () => {
    filter.value = ''; search.value = ''; results.hidden = true; selected = 'metadata';
    describeSelection(); populateGraph();
    graph?.cameraPosition({ x: 0, y: 0, z: 650 }, { x: 0, y: 0, z: 0 }, 0);
    fit();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-map-mode]').forEach(button => button.addEventListener('click', () => {
    dimensions = button.dataset.mapMode === '2' ? 2 : 3;
    root.querySelectorAll('[data-map-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const controls = graph?.controls() as { enableRotate: boolean; mouseButtons: { LEFT: number }; touches: { ONE: number } } | undefined;
    if (controls) {
      controls.enableRotate = dimensions === 3;
      // OrbitControls actions: mouse ROTATE=0/PAN=2, touch ROTATE=0/PAN=1.
      controls.mouseButtons.LEFT = dimensions === 3 ? 0 : 2;
      controls.touches.ONE = dimensions === 3 ? 0 : 1;
    }
    graph?.numDimensions(dimensions);
    graph?.cameraPosition({ x: 0, y: 0, z: 650 }, { x: 0, y: 0, z: 0 }, 0);
    populateGraph();
    root.querySelector('[data-map-gesture]')!.textContent = dimensions === 3 ? 'Drag to turn · Scroll to zoom · Select a label to explore' : 'Drag to pan · Scroll to zoom · Select a label to explore';
    root.dataset.dimensions = String(dimensions);
  }));
  root.querySelector('[data-map-focus]')!.addEventListener('click', () => {
    const near = neighbours();
    graph?.zoomToFit(duration(), 52, node => near.has(String(node.id)));
  });
  try {
    const [{ default: ForceGraph3D }, { default: SpriteText }] = await Promise.all([import('3d-force-graph'), import('three-spritetext')]);
    if (disposed) return;
    loading.remove();
    graph = new ForceGraph3D(canvas, { controlType: 'orbit', rendererConfig: { antialias: true, alpha: false } })
      .width(canvas.clientWidth).height(canvas.clientHeight)
      .backgroundColor('#f7f9f6').showNavInfo(false)
      .enableNodeDrag(false).cooldownTicks(1)
      .nodeLabel('')
      .nodeThreeObject((node: NodeObject) => {
        const concept = node as MapNode;
        const sprite = new SpriteText(concept.label, 10.5, colors[concept.group - 1]);
        sprite.fontFace = 'system-ui, -apple-system, sans-serif';
        sprite.fontSize = 64; sprite.fontWeight = '450';
        sprite.padding = [2.5, 1.5]; sprite.borderRadius = 3;
        sprite.borderWidth = .4;
        sprite.backgroundColor = '#f7f9f6';
        sprite.borderColor = '#f7f9f6';
        labels.set(concept.id, sprite);
        return sprite;
      })
      .linkLabel(link => {
        const typed = link as LinkObject & { label: string };
        const label = document.createElement('span');
        label.textContent = `${byId.get(endpoint(link.source))!.label} ${typed.label} ${byId.get(endpoint(link.target))!.label}`;
        return label;
      })
      .linkOpacity(.65)
      .onEngineStop(() => { styleSelection(); fit(); })
      .onNodeClick(node => { select(String(node.id)); })
      .onLinkClick(link => { select(endpoint(link.source)); });
    graph.cameraPosition({ x: 0, y: 0, z: 650 });
    populateGraph();
    // The controls retain panning in the flat view.
    const controls = graph.controls() as { enableDamping: boolean; dampingFactor: number; screenSpacePanning: boolean; rotateSpeed: number };
    controls.enableDamping = !reducedMotion.matches; controls.dampingFactor = .12; controls.screenSpacePanning = true; controls.rotateSpeed = .4;
    const observer = new ResizeObserver(() => { graph?.width(canvas.clientWidth).height(canvas.clientHeight); });
    observer.observe(canvas);
    const visibility = () => {
      if (document.hidden) graph?.pauseAnimation(); else graph?.resumeAnimation();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', event => {
      if (event.persisted) { graph?.pauseAnimation(); return; }
      disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', visibility); graph?._destructor();
    });
    window.addEventListener('pageshow', () => { if (!disposed) graph?.resumeAnimation(); });
    root.querySelectorAll<HTMLButtonElement>('[data-map-mode], [data-map-reset], [data-map-focus]').forEach(button => button.disabled = false);
    root.dataset.ready = 'true'; root.dataset.dimensions = '3';
    describeSelection(); styleSelection();
  } catch (error) {
    console.error('Knowledge map could not start', error);
    canvas.replaceChildren(make('p', 'The 3D view is unavailable here. Use search or the concept list to explore the same connections and reading links.'));
    canvas.classList.add('map-unavailable');
    root.dataset.ready = 'fallback';
    status.textContent = 'Concepts and chapter links are ready to explore.';
  }
}
