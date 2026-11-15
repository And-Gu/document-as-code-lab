import type { Scenario, SourceRecord, moveTasks } from './chapter-nine-proposals';

interface DemoData { scenario: Scenario; tasks: typeof moveTasks; }

export function initChapterNineProposals() {
  document.querySelectorAll<HTMLElement>('[data-proposal-demo]').forEach(root => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    const { scenario, tasks } = JSON.parse(root.querySelector('[data-proposal-data]')!.textContent!) as DemoData;
    const status = root.querySelector<HTMLElement>('[data-demo-status]')!;
    const inspector = root.querySelector<HTMLElement>('[data-inspector]')!;
    let selected = scenario.sources[0];
    let preview = false;
    const getSource = (id: string) => scenario.sources.find(source => source.id === id)!;

    function inspect(title: string, description: string, facts: string[], focus = true) {
      inspector.querySelector('[data-inspector-title]')!.textContent = title;
      inspector.querySelector('[data-inspector-description]')!.textContent = description;
      const list = inspector.querySelector('[data-inspector-links]')!;
      list.replaceChildren(...facts.map(fact => {
        const item = document.createElement('li');
        item.textContent = fact;
        return item;
      }));
      if (focus) inspector.focus();
    }

    function inspectSource(source: SourceRecord, focus = true) {
      inspect(source.title, source.meaning, [`Maintained value · ${source.value}`, `Proposed value · ${source.proposed}`], focus);
    }

    function updateMap() {
      root.querySelector('[data-map-title]')!.textContent = selected.title;
      root.querySelector('[data-map-value]')!.textContent = selected.value;
      let connectedCount = 0;
      for (const record of scenario.documents) {
        const connected = record.fields.some(field => field.source === selected.id);
        if (connected) connectedCount++;
        const card = root.querySelector<HTMLElement>(`[data-map-document="${record.id}"]`)!;
        card.classList.toggle('connected', connected);
        card.querySelector('[data-map-state]')!.textContent = connected ? 'Uses this source' : 'Uses other sources';
        card.querySelector('[data-map-field]')!.textContent = connected ? selected.value : record.fields.map(field => getSource(field.source).value).join(' · ');
      }
      status.textContent = `${connectedCount} ${connectedCount === 1 ? 'material uses' : 'materials use'} ${selected.title.toLowerCase()}. Follow the links to find who maintains them.`;
    }

    function updateComparison() {
      root.querySelector('[data-change-title]')!.textContent = selected.title;
      root.querySelector('[data-old-value]')!.textContent = selected.value;
      root.querySelector('[data-new-value]')!.textContent = selected.proposed;
      const button = root.querySelector<HTMLButtonElement>('[data-preview-change]')!;
      button.textContent = preview ? 'Show current values' : `Preview ${selected.proposed}`;
      button.setAttribute('aria-pressed', String(preview));
      let count = 0;
      for (const record of scenario.documents) {
        const affected = record.fields.some(field => field.source === selected.id);
        if (affected) count++;
        const card = root.querySelector<HTMLElement>(`[data-comparison-document="${record.id}"]`)!;
        card.classList.toggle('has-changes', preview && affected);
        card.querySelector('[data-comparison-status]')!.textContent = preview && affected ? 'Proposed text changes' : 'Current source values';
        card.querySelectorAll<HTMLElement>('[data-proposed-field]').forEach(field => {
          const source = getSource(field.dataset.proposedField!);
          field.replaceChildren();
          if (preview && source.id === selected.id) {
            const removed = documentCreate('del', source.value);
            const added = documentCreate('ins', source.proposed);
            field.append(removed, document.createTextNode(' '), added);
          } else field.textContent = source.value;
        });
      }
      status.textContent = preview ? `${count} ${count === 1 ? 'material' : 'materials'} would use the proposed ${selected.title.toLowerCase()}. Compare the highlighted text.` : 'Current values are shown. Preview the change to compare its effects.';
    }

    function updateTimeline() {
      const button = root.querySelector<HTMLButtonElement>('[data-preview-change]')!;
      button.textContent = preview ? 'Show current plan' : 'Preview 17 June';
      button.setAttribute('aria-pressed', String(preview));
      for (const task of tasks) {
        const marker = root.querySelector<HTMLElement>(`[data-timeline-task="${task.id}"] .proposed-mark`)!;
        const proposedDay = task.fixedDay ?? 17 + task.offset!;
        marker.hidden = !preview || task.fixedDay !== null;
        marker.style.setProperty('--day', String(proposedDay - 12));
        marker.querySelector('span')!.textContent = `${proposedDay} June`;
      }
      status.textContent = preview ? 'Three proposed task dates move by two days. The lease starts on 14 June in either plan.' : 'The current plan uses 15 June as the move date.';
      inspect('Move date and task rules', preview ? 'The proposed move is 17 June. Relative dates follow the recorded offsets.' : 'The move is planned for 15 June. Relative dates follow the recorded offsets.', tasks.map(task => `${task.title} · ${task.fixedDay ?? (preview ? 17 : 15) + task.offset!} June · ${task.rule}`), false);
    }

    root.querySelectorAll<HTMLButtonElement>('[data-audience]').forEach(button => {
      button.addEventListener('click', () => {
        const audience = button.dataset.audience!;
        let visibleCount = 0;
        root.querySelectorAll<HTMLElement>('[data-document]').forEach(card => {
          card.hidden = Boolean(audience && card.dataset.audienceValue !== audience && card.dataset.audienceValue !== 'Everyone');
          if (!card.hidden) visibleCount++;
        });
        root.querySelectorAll('[data-audience]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        status.textContent = `${visibleCount} materials for ${audience.toLowerCase() || 'all audiences'}`;
      });
    });
    root.querySelectorAll<HTMLButtonElement>('[data-choose-source]').forEach(button => {
      button.addEventListener('click', () => {
        selected = getSource(button.dataset.chooseSource!);
        preview = false;
        root.querySelectorAll('[data-choose-source]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        if (root.dataset.method === 'map') updateMap();
        if (root.dataset.method === 'comparison') updateComparison();
        inspectSource(selected, false);
      });
    });
    root.querySelectorAll<HTMLButtonElement>('[data-inspect-source]').forEach(button => {
      button.addEventListener('click', () => inspectSource(getSource(button.dataset.inspectSource!)));
    });
    root.querySelectorAll<HTMLButtonElement>('[data-inspect-document]').forEach(button => {
      button.addEventListener('click', () => {
        const record = scenario.documents.find(document => document.id === button.dataset.inspectDocument)!;
        inspect(record.title, `${record.purpose} Maintained by ${record.owner}.`, record.fields.map(field => `${field.label} uses ${getSource(field.source).title.toLowerCase()} · ${getSource(field.source).value}`));
      });
    });
    root.querySelectorAll<HTMLButtonElement>('[data-inspect-task]').forEach(button => {
      button.addEventListener('click', () => {
        const task = tasks.find(task => task.id === button.dataset.inspectTask)!;
        inspect(task.title, task.review, [`Rule · ${task.rule}`, `Current date · ${task.fixedDay ?? 15 + task.offset!} June`, `Date in this preview · ${task.fixedDay ?? (preview ? 17 : 15) + task.offset!} June`, `Owner · ${task.owner}`]);
      });
    });
    root.querySelector<HTMLButtonElement>('[data-preview-change]')?.addEventListener('click', () => {
      preview = !preview;
      if (root.dataset.method === 'timeline') updateTimeline();
      else updateComparison();
    });
  });
}

function documentCreate(tag: 'del' | 'ins', value: string) {
  const node = document.createElement(tag);
  node.textContent = value;
  return node;
}
