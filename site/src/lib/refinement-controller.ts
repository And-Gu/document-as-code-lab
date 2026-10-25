import { deriveRefinement, initialPractice, validatePractice, type Practice, type RefinementData } from './refinement-model';
import { renderRefinement } from './refinement-view';
export function initRefinement() {
  document.querySelectorAll<HTMLElement>('[data-refinement]').forEach(root => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    const data: RefinementData = JSON.parse(root.querySelector('[data-ref-data]')!.textContent!);
    const base = root.dataset.base!;
    const output = root.querySelector<HTMLElement>('[data-ref-output]')!, status = root.querySelector<HTMLElement>('[data-ref-status]')!;
    const forecast = root.querySelector<HTMLInputElement>('#ref-forecast')!;
    const mapping = [...root.querySelectorAll<HTMLInputElement>('[name="ref-mapping"]')];
    const includes = [...root.querySelectorAll<HTMLInputElement>('[data-ref-include]')];
    const replay = root.querySelector<HTMLElement>('[data-ref-replay-status]')!;
    let built = initialPractice(), state = 'Initial result: mapping unresolved. Build after changing the practice inputs.';
    let replayed = false;
    const current = (): Practice => ({ mapping: mapping[0].checked, forecast: forecast.value, excluded: includes.filter(c => !c.checked).map(c => c.value) });
    function controls(p: Practice) { mapping[0].checked = p.mapping; mapping[1].checked = !p.mapping; forecast.value = p.forecast; includes.forEach(c => { c.checked = !p.excluded.includes(c.value); }); }
    // A bounded URL fragment carries fictional practice inputs and the last successful build.
    // It restores both sides of a stale/failed result without cookies or persistent storage.
    function links() {
      const hash = `#practice=${encodeURIComponent(JSON.stringify({ current: current(), built, state, replayed }))}`;
      root.querySelectorAll<HTMLAnchorElement>('[data-ref-source]').forEach(a => { a.hash = hash; });
    }
    function draw() { output.innerHTML = renderRefinement(data, deriveRefinement(data, built), base); status.textContent = state; links(); }
    const messages = ['Initial result: mapping unresolved. Build after changing the practice inputs.', 'Built from the current practice inputs. Draft only; not approved or sent.', 'Results are based on the previous inputs. Build briefing to update them.', 'Build failed: use a real date in YYYY-MM-DD format. Results are based on the previous inputs.'];
    if (location.hash.startsWith('#practice=')) {
      try {
        if (location.hash.length > 8000) throw new Error('Oversized practice context');
        const saved = JSON.parse(decodeURIComponent(location.hash.slice(10)));
        validatePractice(data, saved.built);
        // Preserve invalid in-progress date text so returning from evidence does not erase an edit.
        if (typeof saved.current.forecast !== 'string' || saved.current.forecast.length > 10) throw new Error('Invalid practice text');
        validatePractice(data, { ...saved.current, forecast: '' });
        if (!messages.includes(saved.state) || typeof saved.replayed !== 'boolean') throw new Error('Invalid practice state');
        controls(saved.current); built = saved.built; state = saved.state; replayed = saved.replayed;
      } catch { state = messages[0]; }
    }
    root.querySelectorAll<HTMLButtonElement | HTMLFieldSetElement>('[disabled]').forEach(el => { el.disabled = false; });
    function replayStatus() { root.querySelector<HTMLElement>('[data-ref-mode]')!.hidden = !replayed; replay.textContent = replayed ? 'Illustrative agent workflow — deterministic replay, not a live AI run. The result above comes from the same rules and selected inputs. No source was changed and no action was sent.' : 'The sequence is illustrative. Replay uses the same rules as Build briefing, with your current mapping choice and sources.'; }
    function build(asReplay = false) {
      try {
        const next = current(); deriveRefinement(data, next); built = next; state = messages[1]; replayed = asReplay;
        forecast.removeAttribute('aria-invalid');
      } catch { state = messages[3]; forecast.setAttribute('aria-invalid', 'true'); forecast.focus(); }
      draw(); replayStatus();
    }
    const changed = () => { state = messages[2]; status.textContent = state; links(); };
    forecast.addEventListener('input', changed);
    [...mapping, ...includes].forEach(c => c.addEventListener('change', changed));
    root.querySelector('[data-ref-build]')!.addEventListener('click', () => build());
    root.querySelector('[data-ref-replay]')!.addEventListener('click', () => build(true));
    root.querySelector('[data-ref-example]')!.addEventListener('click', () => { controls({ ...initialPractice(), mapping: true }); build(); document.getElementById('ref-results')!.scrollIntoView(); });
    root.querySelector('[data-ref-reset]')!.addEventListener('click', () => { controls(initialPractice()); built = initialPractice(); state = messages[0]; replayed = false; forecast.removeAttribute('aria-invalid'); draw(); replayStatus(); mapping[1].focus(); });
    draw(); replayStatus();
  });
}
