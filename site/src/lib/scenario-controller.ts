import type { ScenarioCheck } from './scenario-checks';

export function initScenarioChecks() {
  document.querySelectorAll<HTMLElement>('[data-scenario-check]').forEach(root => {
    if (root.dataset.scenarioReady) return;
    const scenario = JSON.parse(root.querySelector('[data-scenario-data]')!.textContent!) as ScenarioCheck;
    const form = root.querySelector<HTMLFormElement>('form')!;
    const feedback = root.querySelector<HTMLElement>('[data-scenario-feedback]')!;
    const inputs = [...form.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    const clear = () => { feedback.replaceChildren(); delete feedback.dataset.result; };
    form.addEventListener('change', clear);
    form.addEventListener('reset', () => {
      clear();
      form.querySelector<HTMLDetailsElement>('[data-scenario-hint]')?.removeAttribute('open');
      requestAnimationFrame(() => inputs[0]?.focus());
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const selected = inputs.find(input => input.checked)?.value;
      clear();
      const message = document.createElement('p');
      if (!selected) {
        message.textContent = 'Choose an answer before checking.';
        feedback.append(message); inputs[0]?.focus(); return;
      }
      const correct = selected === scenario.correctChoice;
      feedback.dataset.result = correct ? 'correct' : 'incorrect';
      const answer = scenario.choices.find(choice => choice.id === scenario.correctChoice)!;
      message.textContent = `${correct ? 'Correct.' : 'Not quite.'} ${scenario.feedback}`;
      const takeaway = document.createElement('p');
      takeaway.textContent = `Takeaway: ${scenario.takeaway}`;
      const expected = document.createElement('p');
      expected.textContent = `Best answer: ${answer.label}`;
      feedback.append(message, expected, takeaway);
    });
    root.querySelector<HTMLElement>('[data-scenario-fallback]')!.hidden = true;
    form.hidden = false;
    root.dataset.scenarioReady = 'true';
  });
}
