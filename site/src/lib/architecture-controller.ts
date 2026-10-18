export function initArchitectureExplorers() {
  document.querySelectorAll<HTMLElement>('[data-architecture-explorer]').forEach(root => {
    if (root.dataset.ready) return;
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-architecture-tab]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[data-architecture-panel]')];
    if (!tabs.length || tabs.length !== panels.length) return;
    const select = (index: number) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
          : event.key === 'ArrowRight' ? (index + 1) % tabs.length
          : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : null;
        if (next === null) return;
        event.preventDefault(); select(next); tabs[next].focus();
      });
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
    });
    root.querySelector<HTMLElement>('[data-architecture-tabs]')!.hidden = false;
    root.querySelector<HTMLDetailsElement>('[data-architecture-fallback]')!.open = false;
    root.dataset.ready = 'true';
  });
}
