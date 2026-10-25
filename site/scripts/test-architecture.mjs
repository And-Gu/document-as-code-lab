import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
async function load(relative) {
  const source = await readFile(new URL(relative, import.meta.url), 'utf8');
  let code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  if (relative.endsWith('/repository.ts')) {
    const selection = await readFile(new URL('../src/lib/public-specifications.ts', import.meta.url), 'utf8');
    const compiled = ts.transpileModule(selection, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
    code = code.replace("from './public-specifications'", `from 'data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}'`);
  }
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
const { architectureExamples, validateArchitectureSources } = await load('../src/lib/architecture.ts');
const { repositoryFiles } = await load('../src/lib/repository.ts');
const published = new Set(await repositoryFiles());
assert.ok(published.has('spec/tutorial/working-methods-upgrade/02-PR1-AUDIENCE-AND-READER-EXPERIENCE.md'));
assert.ok(!published.has('spec/tutorial/working-methods-upgrade/private-notes.md'));
const { publicSpecifications } = await load('../src/lib/public-specifications.ts');
assert.deepEqual([...published].filter(file => file.startsWith('spec/')).sort(), [...publicSpecifications, 'spec/tutorial/working-methods-upgrade/verification/evidence-index.json'].sort());
await validateArchitectureSources(root, published);
assert.equal(architectureExamples.length, 5);
await assert.rejects(validateArchitectureSources(root, new Set()), /not exposed/);
await assert.rejects(validateArchitectureSources(root, published, [architectureExamples[0], architectureExamples[0]]), /Duplicate/);
const bad = { ...architectureExamples[0], sources: ['missing.md'] };
await assert.rejects(validateArchitectureSources(root, new Set([...published, 'missing.md']), [bad]), /ENOENT/);
for (const example of architectureExamples) {
  for (const source of [...example.sources, ...example.processors]) {
    assert.equal(await readFile(new URL(`../dist/files/${source}`, import.meta.url), 'utf8'), await readFile(`${root}/${source}`, 'utf8'), source);
  }
}
assert.match(architectureExamples.find(e => e.id === 'pdf').output, /actions\/workflows\/pdf-proof.yml$/);
assert.match(architectureExamples.find(e => e.id === 'dashboard').boundary, /opt-in/);
const chapter = await readFile(new URL('../dist/chapters/11-beyond-github/index.html', import.meta.url), 'utf8');
const dom = parse(chapter);
const attr = (n, name) => n.attrs?.find(a => a.name === name)?.value;
const all = (n, predicate) => [...(predicate(n) ? [n] : []), ...(n.childNodes ?? []).flatMap(c => all(c, predicate))];
assert.equal(all(dom, n => attr(n, 'data-architecture-explorer') !== undefined).length, 1);
assert.equal(all(dom, n => attr(n, 'id') === 'architecture-explorer-widget').length, 1);
const tabs = all(dom, n => attr(n, 'data-architecture-tabs') !== undefined)[0];
assert.notEqual(attr(tabs, 'hidden'), undefined, 'Controls stay hidden until enhancement succeeds');
const fallback = all(dom, n => attr(n, 'data-architecture-fallback') !== undefined)[0];
assert.notEqual(attr(fallback, 'open'), undefined, 'The overview remains open without JavaScript');
assert.equal(all(fallback, n => n.tagName === 'tbody')[0].childNodes.filter(n => n.tagName === 'tr').length, 5);
assert.equal(all(dom, n => attr(n, 'data-architecture-panel') !== undefined).length, 5);
assert.ok(!chapter.includes('Proposed site component'));
assert.ok(chapter.includes('https://github.com/And-Gu/document-as-code-lab/blob/main/.github/workflows/deploy-pages.yml'));
assert.ok(chapter.includes('https://github.com/And-Gu/document-as-code-lab/blob/main/.github/workflows/pdf-proof.yml'));
assert.ok(!chapter.includes('/files/.github/'));
assert.ok(chapter.includes('Copilot agent can answer questions'));

// Exercise the small controller without a browser or a second DOM dependency.
const { initArchitectureExplorers } = await load('../src/lib/architecture-controller.ts');
class Element {
  constructor(id) { this.id = id; this.handlers = {}; this.attributes = {}; this.hidden = false; }
  setAttribute(k, v) { this.attributes[k] = v; }
  addEventListener(k, callback) { this.handlers[k] = callback; }
  focus() { this.focused = true; }
}
const buttons = architectureExamples.map(e => new Element(`architecture-tab-${e.id}`));
const panels = architectureExamples.map(() => new Element());
const bar = new Element(); bar.hidden = true;
const overview = { open: true };
const host = { dataset: {},
  querySelectorAll: selector => selector === '[data-architecture-tab]' ? buttons : panels,
  querySelector: selector => selector === '[data-architecture-tabs]' ? bar : overview,
};
globalThis.document = { querySelectorAll: () => [host] };
try {
  initArchitectureExplorers();
  assert.equal(bar.hidden, false); assert.equal(overview.open, false);
  buttons[2].handlers.click();
  assert.equal(buttons[2].attributes['aria-selected'], 'true');
  assert.equal(panels[2].hidden, false);
  assert.ok(panels.filter(p => !p.hidden).length === 1);
  const key = (index, value) => buttons[index].handlers.keydown({ key: value, preventDefault() {} });
  key(2, 'End'); assert.equal(buttons[4].focused, true);
  key(4, 'ArrowRight'); assert.equal(buttons[0].attributes['aria-selected'], 'true');
  key(0, 'ArrowLeft'); assert.equal(buttons[4].attributes['aria-selected'], 'true');
  key(4, 'Home'); assert.equal(buttons[0].tabIndex, 0);
  initArchitectureExplorers(); assert.equal(host.dataset.ready, 'true');
} finally { delete globalThis.document; }
console.log('Architecture source validation, original-source routes, static fallback, tab selection, and keyboard navigation passed.');
