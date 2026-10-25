let nextEditor = 0;
export function initEditorTabs(root: HTMLElement) {
  const bar = root.querySelector<HTMLElement>('[data-editor-tabs]')!;
  const tabs = [...bar.querySelectorAll<HTMLButtonElement>('[data-editor-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-editor-panel]')];
  const narrow = window.matchMedia('(max-width: 700px)');
  const id = `editor-${++nextEditor}`;
  let active = 'source';
  tabs.forEach((tab, index) => { tab.id = `${id}-tab-${index}`; panels[index].id = `${id}-panel-${index}`; });
  function render() {
    const mobile = narrow.matches;
    // Keep focus in a visible place across responsive changes.
    const focusedPanel = panels.find(panel => panel.contains(document.activeElement));
    if (mobile && focusedPanel) active = focusedPanel.dataset.editorPanel!;
    if (!mobile && bar.contains(document.activeElement)) panels.find(panel => panel.dataset.editorPanel === active)?.querySelector<HTMLElement>('textarea, [tabindex]')?.focus();
    bar.hidden = !mobile;
    if (mobile) bar.setAttribute('role', 'tablist'); else bar.removeAttribute('role');
    tabs.forEach((tab, index) => {
      const selected = tab.dataset.editorTab === active, panel = panels[index];
      panel.hidden = mobile && !selected;
      if (mobile) {
        tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', String(selected));
        tab.setAttribute('aria-controls', panel.id); tab.tabIndex = selected ? 0 : -1;
        panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', tab.id);
      } else {
        tab.removeAttribute('role'); tab.removeAttribute('aria-selected'); tab.removeAttribute('aria-controls');
        panel.removeAttribute('role'); panel.removeAttribute('aria-labelledby');
      }
    });
  }
  function select(index: number) { active = tabs[index].dataset.editorTab!; render(); }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' || event.key === 'ArrowLeft' ? 1 - index : event.key === 'Home' ? 0 : event.key === 'End' ? 1 : undefined;
      if (next !== undefined) { event.preventDefault(); tabs[next].focus(); select(next); }
    });
  });
  render(); narrow.addEventListener('change', render);
  return () => { active = 'source'; render(); };
}
