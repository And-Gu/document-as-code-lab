import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseHtml } from 'parse5';
import { parse as parseYaml } from 'yaml';

const root = fileURLToPath(new URL('../../', import.meta.url));
const dist = path.join(root, 'site/dist');
const expected = ["01-introduction","github-workspace","02-project-growth","03-markdown","03a-structured-content","information-architecture","processing-information","04-ai-native","05-images","08-publishing","09-beyond-github"];
const slugs = ["01-introduction","02-github-workspace","03-project-growth","04-markdown","05-structured-content","06-information-architecture","07-processing","08-ai-native","09-images","10-publishing","11-beyond-github"];
assert.equal((await readdir(path.join(root, 'docs'))).filter(name => name.endsWith('.md')).length, 11);
for (const [index, slug] of slugs.entries()) {
  const source = await readFile(path.join(root, `docs/${slug}.md`), 'utf8');
  const front = source.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(front, slug);
  const metadata = parseYaml(front[1]);
  assert.equal(metadata.id, expected[index]);
  assert.equal(metadata.chapter_number, index + 1);
  assert.ok(!/\[AGENT(?:\s|:)/.test(source) && !source.includes('VISUAL:'), slug);
  for (const visual of metadata.visuals ?? []) {
    const diagram = await readFile(path.resolve(root, 'docs', visual.source), 'utf8');
    assert.ok(source.includes(`\n${diagram.trim()}\n`), `${slug}: diagram differs from its maintained source`);
  }
}
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(name);
    else if (name.endsWith('.html')) files.push(name);
  }
}
await collect(dist);
let links = 0;
const errors = [];
for (const file of files) {
  const attributes = [];
  function walk(node) {
    for (const attribute of node.attrs ?? []) {
      if (['href', 'src'].includes(attribute.name) && attribute.value.startsWith('/document-as-code-lab/')) attributes.push(attribute.value);
    }
    for (const child of node.childNodes ?? []) walk(child);
  }
  walk(parseHtml(await readFile(file, 'utf8')));
  for (const value of attributes) {
    assert.ok(!value.includes('/files/.github/'), `Pages artifacts exclude .github: ${file}: ${value}`);
    const url = new URL(value, 'https://example.com');
    let target = path.join(dist, decodeURIComponent(url.pathname.replace('/document-as-code-lab/', '')));
    links++;
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
      if (url.hash && target.endsWith('.html')) {
        const content = await readFile(target, 'utf8');
        assert.ok(content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`));
      }
    } catch { errors.push(`${path.relative(dist, file)}: ${value}`); }
  }
}
assert.deepEqual(errors, []);
for (const [old, target] of Object.entries({
  '10-git-review': '02-github-workspace',
  '11-publishing': '10-publishing', '12-beyond-github': '11-beyond-github',
  '12-publishing': '10-publishing', '13-beyond-github': '11-beyond-github',
})) {
  const redirect = await readFile(path.join(dist, 'chapters', old, 'index.html'), 'utf8');
  assert.ok(redirect.includes(`/document-as-code-lab/chapters/${target}/`), `Missing redirect: ${old}`);
}
for (const old of ['10-quality-checks', '11-quality-checks']) {
  const redirect = await readFile(path.join(dist, 'chapters', old, 'index.html'), 'utf8');
  assert.ok(redirect.includes('/document-as-code-lab/materials/reference/automation-quality/'), `Missing quality reference redirect: ${old}`);
}
for (const old of ['12-automation', '13-automation', '14-automation']) {
  const redirect = await readFile(path.join(dist, 'chapters', old, 'index.html'), 'utf8');
  assert.ok(redirect.includes('/document-as-code-lab/materials/reference/automation-quality/#plan-a-first-increment'), `Missing adoption reference redirect: ${old}`);
  assert.ok(!redirect.includes('data-learning-quiz'), 'A retired URL is not another chapter');
}
const lastChapter = parseHtml(await readFile(path.join(dist, 'chapters/11-beyond-github/index.html'), 'utf8'));
function findNodes(node, predicate) {
  return [...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => findNodes(child, predicate))];
}
const attribute = (node, name) => node.attrs?.find(attr => attr.name === name)?.value;
const navigation = findNodes(lastChapter, node => attribute(node, 'aria-label') === 'Chapter navigation')[0];
const navLinks = findNodes(navigation, node => node.tagName === 'a');
assert.equal(navLinks.length, 1, 'The final chapter has only a previous link');
assert.equal(attribute(navLinks[0], 'href'), '/document-as-code-lab/chapters/10-publishing/');
assert.ok(!findNodes(lastChapter, node => node.tagName === 'a').some(node => /\/chapters\/(12|13|14)-automation\//.test(attribute(node, 'href') ?? '')));
console.log(`Stable chapter IDs, maintained Mermaid sources, and ${links} internal links/assets across ${files.length} HTML pages passed.`);

const descriptions = new Set();
for (const slug of ['', ...slugs.map(slug => `chapters/${slug}/`)]) {
  const doc = parseHtml(await readFile(path.join(dist, slug, 'index.html'), 'utf8'));
  const meta = name => findNodes(doc, node => node.tagName === 'meta' && (attribute(node, 'name') === name || attribute(node, 'property') === name))[0];
  const description = attribute(meta('description'), 'content');
  assert.ok(description && description.length > 40); descriptions.add(description);
  const canonical = findNodes(doc, node => attribute(node, 'rel') === 'canonical')[0];
  assert.equal(attribute(canonical, 'href'), `https://and-gu.github.io/document-as-code-lab/${slug}`);
  assert.equal(attribute(meta('og:url'), 'content'), attribute(canonical, 'href'));
  assert.equal(attribute(meta('og:description'), 'content'), description);
  assert.ok(attribute(meta('og:title'), 'content'));
  assert.equal(attribute(meta('og:image'), 'content'), 'https://and-gu.github.io/document-as-code-lab/files/assets/illustrations/information-workshop.jpg');
  assert.ok(attribute(meta('og:image:alt'), 'content'));
  assert.equal(findNodes(doc, node => node.tagName === 'h1').length, 1, `One page title: ${slug}`);
  if (slug) {
    const contents = findNodes(doc, node => attribute(node, 'aria-label') === 'On this page')[0];
    if (contents) assert.ok(!findNodes(contents, node => node.tagName === 'a').some(node => /^#(?:metadata-validation|ce-|chapter-information|Requesting)/.test(attribute(node, 'href'))));
    const chapterMeta = findNodes(doc, node => attribute(node, 'class') === 'chapter-meta')[0];
    assert.ok(chapterMeta && !findNodes(chapterMeta, node => node.nodeName === '#text').map(node => node.value).join('').includes('in-review'));
  }
}
assert.equal(descriptions.size, 12, 'Homepage and each chapter need their own description');
const { diagramRelationships } = await import('../plugins/readable-diagrams.mjs');
for (const [slug, expected] of [
  ['06-information-architecture', [
    'REQ-001: Access requirement constrains PROC-001: Access procedure.',
    'PROC-001: Access procedure guides ACT-003: System orientation.',
    'ACT-001: Access enabled prerequisite for ACT-003: System orientation.',
    'ACT-002: Security training complete prerequisite for ACT-003: System orientation.',
  ]],
  ['07-processing', ['Sources leads to Checks.', 'Checks leads to Transformations.', 'Transformations leads to Generated outputs.', 'Human review reviews Generated outputs.', 'Generated outputs leads to Separate publication.']],
]) {
  const source = await readFile(path.join(root, `docs/${slug}.md`), 'utf8');
  const code = source.match(/```mermaid\n([\s\S]*?)\n```/)[1];
  assert.deepEqual(diagramRelationships(code).map(row => `${row.from} ${row.relation} ${row.to}.`), expected);
  const html = await readFile(path.join(dist, `chapters/${slug}/index.html`), 'utf8');
  const rendered = slug === '07-processing' ? ['From sources to checks.', 'From checks to transformations.', 'From transformations to generated outputs.', 'Human review assesses generated outputs.', 'From generated outputs to separate publication.'] : expected;
  for (const statement of rendered) assert.ok(html.includes(statement), statement);
}
assert.throws(() => diagramRelationships('flowchart LR\nA[One] -- unknown --> B[Two]'), /Unsupported|Unresolved/);
assert.ok(files.some(file => file.endsWith('materials/spec/tutorial/working-methods-upgrade/02-PR1-AUDIENCE-AND-READER-EXPERIENCE/index.html')));
console.log('Page descriptions, canonical/social URLs, heading hierarchy, readable diagram equivalence and selected nested planning pages passed.');
