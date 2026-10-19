import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';
import ts from 'typescript';
import chapterSemantics from '../plugins/chapter-semantics.mjs';
import growthWidget from '../plugins/growth-widget.mjs';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const compile = source => ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const learningUrl = moduleUrl(compile(await read('../src/lib/learning.ts'))
  .replace("from 'markdown-it'", `from '${import.meta.resolve('markdown-it')}'`));
const schema = JSON.parse(await read('../../examples/learning/scenario-checks.schema.json'));
const code = compile(await read('../src/lib/scenario-checks.ts'))
  .replace("from 'ajv'", `from '${import.meta.resolve('ajv')}'`)
  .replace(/import schema from [^;]+;/, `const schema = ${JSON.stringify(schema)};`)
  .replace("from './learning'", `from '${learningUrl}'`);
const { prepareScenarioChecks } = await import(moduleUrl(code));
const scenarios = JSON.parse(await read('../../examples/learning/scenario-checks.json'));
assert.deepEqual(prepareScenarioChecks(scenarios).map(s => [s.id, s.chapter, s.correctChoice]), [
  ['metadata-owner-validity', 5, 'yes'], ['policy-change-impact', 6, 'review'], ['agent-knowledge-locations', 8, 'separate'],
]);
const invalid = edit => { const copy = structuredClone(scenarios); edit(copy); assert.throws(() => prepareScenarioChecks(copy)); };
for (const value of [null, {}, [], [{ id: 'partial' }]]) assert.throws(() => prepareScenarioChecks(value));
invalid(s => { s[0].correctChoice = 'absent'; });
invalid(s => { s[1].id = s[0].id; });
invalid(s => { s[1].marker = s[0].marker; });
invalid(s => { s[0].choices[1].id = s[0].choices[0].id; });
invalid(s => { s[0].chapter = 12; });
invalid(s => { s[0].feedback = ' '; });
invalid(s => { s[0].extra = true; });
invalid(s => { s[0].choices = [s[0].choices[0]]; });
invalid(s => { s[0].choices.push({ id: 'four', label: 'four' }, { id: 'five', label: 'five' }); });

const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const all = (node, predicate) => [...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => all(child, predicate))];
for (const [chapter, slug] of [[5, '05-structured-content'], [6, '06-information-architecture'], [8, '08-ai-native']]) {
  const html = await read(`../dist/chapters/${slug}/index.html`);
  const scenario = scenarios.find(s => s.chapter === chapter);
  const dom = parse(html);
  const hosts = all(dom, n => attr(n, 'data-scenario-check') !== undefined);
  assert.equal(hosts.length, 1);
  const host = hosts[0];
  assert.equal(attr(host, 'data-scenario-check'), scenario.id);
  assert.equal(all(dom, n => attr(n, 'id') === `${scenario.marker}-widget`).length, 1);
  assert.equal(all(host, n => n.tagName === 'fieldset').length, 1);
  assert.equal(all(host, n => n.tagName === 'legend').length, 1);
  const inputs = all(host, n => n.tagName === 'input');
  assert.equal(inputs.length, scenario.choices.length);
  assert.ok(inputs.every(n => attr(n, 'type') === 'radio' && attr(n, 'name') === scenario.id));
  assert.notEqual(attr(all(host, n => n.tagName === 'form')[0], 'hidden'), undefined);
  const fallback = all(host, n => attr(n, 'data-scenario-fallback') !== undefined)[0];
  assert.equal(attr(fallback, 'hidden'), undefined);
  const explanation = all(fallback, n => n.tagName === 'details')[0];
  assert.equal(attr(explanation, 'open'), undefined);
  assert.ok(html.includes(scenario.feedback));
  assert.equal(all(host, n => attr(n, 'role') === 'status').length, 1);
  const article = all(dom, n => n.tagName === 'article')[0];
  assert.equal(article.childNodes.filter(n => n.tagName === 'h1').length, 1, 'One chapter title, excluding the editor preview');
  assert.equal(all(dom, n => attr(n, 'class')?.split(' ').includes('chapter-information')).length, 1);
}
const source = await read('../src/components/learning/ScenarioCheck.astro');
assert.ok(source.includes(".replaceAll('<', '\\\\u003c')"), 'Embedded data escapes script-closing input');
assert.doesNotMatch(source, /set:html=\{scenario\./);
const controller = await read('../src/lib/scenario-controller.ts');
assert.doesNotMatch(controller, /\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|document.cookie|innerHTML/);

// Small controller test doubles keep the standard test suite browser-independent.
class Node {
  constructor() { this.children = []; this.handlers = {}; this.dataset = {}; this.hidden = false; this.textContent = ''; }
  addEventListener(name, fn) { this.handlers[name] = fn; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  removeAttribute(name) { delete this[name]; }
  focus() { this.focused = true; }
}
const { initScenarioChecks } = await import(moduleUrl(compile(controller)));
const roots = scenarios.map(scenario => {
  const feedback = new Node(), fallback = new Node(), hint = new Node(), form = new Node();
  const inputs = scenario.choices.map(choice => Object.assign(new Node(), { value: choice.id, checked: false }));
  form.hidden = true; form.querySelectorAll = () => inputs; form.querySelector = () => hint;
  const root = new Node();
  const nodes = { '[data-scenario-data]': { textContent: JSON.stringify(scenario) }, form, '[data-scenario-feedback]': feedback, '[data-scenario-fallback]': fallback };
  root.querySelector = selector => nodes[selector];
  return { root, form, feedback, fallback, hint, inputs, scenario };
});
globalThis.document = { querySelectorAll: () => roots.map(r => r.root), createElement: () => new Node() };
globalThis.requestAnimationFrame = fn => fn();
try {
  initScenarioChecks();
  for (const { root, form, feedback, fallback, hint, inputs, scenario } of roots) {
    assert.equal(root.dataset.scenarioReady, 'true'); assert.equal(form.hidden, false); assert.equal(fallback.hidden, true);
    assert.equal(feedback.children.length, 0, 'No explanation before Check answer');
    const submit = () => form.handlers.submit({ preventDefault() {} });
    submit(); assert.match(feedback.children[0].textContent, /Choose an answer/);
    assert.equal(inputs[0].focused, true);
    inputs.find(input => input.value !== scenario.correctChoice).checked = true;
    form.handlers.change(); assert.equal(feedback.children.length, 0);
    submit(); assert.equal(feedback.dataset.result, 'incorrect');
    assert.ok(feedback.children.some(n => n.textContent.includes(scenario.feedback)));
    for (const input of inputs) input.checked = input.value === scenario.correctChoice;
    form.handlers.change(); submit(); assert.equal(feedback.dataset.result, 'correct');
    hint.open = true; form.handlers.reset();
    assert.equal(feedback.children.length, 0); assert.equal(feedback.dataset.result, undefined);
    assert.equal(hint.open, undefined); assert.equal(inputs[0].focused, true);
  }
  const firstHandler = roots[0].form.handlers.submit;
  initScenarioChecks(); assert.equal(roots[0].form.handlers.submit, firstHandler, 'No duplicate event listeners');
} finally { delete globalThis.document; delete globalThis.requestAnimationFrame; }
const tree = { type: 'root', children: [{ type: 'element', tagName: 'blockquote', properties: {}, children: [{ type: 'text', value: 'Explore further: Read the guide.' }] }] };
chapterSemantics()(tree);
assert.deepEqual(tree.children[0].properties.className, ['supporting-reference']);
for (const scenario of scenarios) {
  const markerTree = { type: 'root', children: [{ type: 'raw', value: `<!-- interactive: ${scenario.marker} -->` }] };
  growthWidget()(markerTree);
  assert.equal(markerTree.children[0].properties.id, `${scenario.marker}-widget`);
}
console.log('Three scenario configurations, schema failures, safe rendering, static alternatives, selection/check/retry/hint/focus states, and no persistence/network passed.');
