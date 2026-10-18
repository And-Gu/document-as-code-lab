import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseHtml } from 'parse5';
import { parse as parseYaml } from 'yaml';

const root = fileURLToPath(new URL('../../', import.meta.url));
const dist = path.join(root, 'site/dist');
const expected = ["01-introduction","github-workspace","02-project-growth","03-markdown","03a-structured-content","information-architecture","processing-information","04-ai-native","05-images","quality-checks","08-publishing","09-beyond-github","10-automation"];
const slugs = ["01-introduction","02-github-workspace","03-project-growth","04-markdown","05-structured-content","06-information-architecture","07-processing","08-ai-native","09-images","10-quality-checks","11-publishing","12-beyond-github","13-automation"];
assert.equal((await readdir(path.join(root, 'docs'))).filter(name => name.endsWith('.md')).length, 13);
for (const [index, slug] of slugs.entries()) {
  const source = await readFile(path.join(root, `docs/${slug}.md`), 'utf8');
  const front = source.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(front, slug);
  const metadata = parseYaml(front[1]);
  assert.equal(metadata.id, expected[index]);
  assert.equal(metadata.chapter_number, index + 1);
  assert.ok(!source.includes('[AGENT') && !source.includes('VISUAL:'), slug);
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
  '10-git-review': '02-github-workspace', '11-quality-checks': '10-quality-checks',
  '12-publishing': '11-publishing', '13-beyond-github': '12-beyond-github', '14-automation': '13-automation',
})) {
  const redirect = await readFile(path.join(dist, 'chapters', old, 'index.html'), 'utf8');
  assert.ok(redirect.includes(`/document-as-code-lab/chapters/${target}/`), `Missing redirect: ${old}`);
}
console.log(`Stable chapter IDs, maintained Mermaid sources, and ${links} internal links/assets across ${files.length} HTML pages passed.`);
