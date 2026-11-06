import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, serialize } from 'parse5';
import { parse as yaml } from 'yaml';

const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const attr = (node, key) => node.attrs?.find(item => item.name === key)?.value;
const all = (node, predicate) => [...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => all(child, predicate))];
const hasClass = (node, value) => attr(node, 'class')?.split(' ').includes(value);
const text = node => all(node, item => item.nodeName === '#text').map(item => item.value).join(' ').replace(/\s+/g, ' ').trim();
const slugs = (await readdir(new URL('../../docs/', import.meta.url))).filter(name => name.endsWith('.md'));
assert.equal(slugs.length, 12);
const numbers = [];
const icons = new Map();
const chapterNumbers = new Map();
for (const file of slugs) {
  const source = await read(`../../docs/${file}`);
  const metadata = yaml(source.match(/^---\n([\s\S]*?)\n---/)[1]);
  numbers.push(metadata.chapter_number);
  chapterNumbers.set(file, metadata.chapter_number);
  const page = parse(await read(`../dist/chapters/${file.slice(0,-3)}/index.html`));
  const glances = all(page, node => hasClass(node, 'chapter-glance'));
  assert.equal(glances.length, 1, file);
  const glance = glances[0];
  const title = all(glance, node => node.tagName === 'h2')[0];
  assert.equal(attr(glance, 'aria-labelledby'), attr(title, 'id'));
  assert.match(text(title), new RegExp(`Chapter ${String(metadata.chapter_number).padStart(2,'0')} . At a Glance`));
  const tiles = all(glance, node => hasClass(node, 'chapter-glance__tile'));
  assert.equal(tiles.length, 6, file);
  assert.equal(all(glance, node => node.tagName === 'ul').length, 1);
  assert.equal(new Set(tiles.map(tile => text(all(tile, node => node.tagName === 'strong')[0]))).size, 6);
  assert.equal(all(glance, node => attr(node, 'tabindex') !== undefined).length, 0, 'Static tiles must not create keyboard stops');
  for (const tile of tiles) {
    assert.equal(tile.tagName, 'li');
    assert.equal(all(tile, node => node.tagName === 'svg' && attr(node, 'aria-hidden') === 'true').length, 1);
    assert.ok(text(tile).length > 15);
  }
  // The same meaning must keep its icon even at different positions or in another chapter.
  for (const tile of tiles) {
    const label = text(all(tile, node => node.tagName === 'strong')[0]);
    const icon = all(tile, node => node.tagName === 'svg')[0];
    const shape = serialize(icon);
    if (icons.has(label)) assert.equal(shape, icons.get(label), label);
    else icons.set(label, shape);
  }
}
assert.deepEqual(numbers.sort((a,b) => a-b), Array.from({length:12},(_,index)=>index+1));
const chapter = await read('../../docs/10-data-enrichment.md');
const cases = JSON.parse(await read('../../examples/data-enrichment/cases.json')).cases;
for (const item of cases) {
  const short = value => value ? `${Number(value.slice(8))} Apr` : '—';
  assert.ok(chapter.includes(`| ${item.id} | ${item.team} | ${short(item.opened)} | ${short(item.closed)} | ${item.label} |`));
}
const report = JSON.parse(await read('../../assets/data-enrichment/analysis.json'));
assert.equal(report.median_days, 6);
assert.equal(report.included_count, 3);
assert.match(chapter, /median of 6 days/);
assert.match(chapter, /cannot compare team performance/);
const spec = await read('../../spec/tutorial/02-DOCUMENT-AS-CODE-LAB-V1-SPECIFICATION.md');
assert.ok(!spec.includes('\\n'), 'No escaped newlines in the curriculum specification');
assert.match(spec, /^\| \*\*11\. Automating/m);
const readme = await read('../../README.md');
assert.match(readme, /^10\. \[From Data to Knowledge\]/m);
assert.match(readme, /^12\. \[Behind the Lab/m);
for (const directory of ['docs', 'reference']) {
  for (const file of (await readdir(new URL(`../../${directory}/`, import.meta.url))).filter(file => file.endsWith('.md'))) {
    const source = await read(`../../${directory}/${file}`);
    for (const match of source.matchAll(/\[[Cc]hapter (\d+)[^\]]*\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(match[2])) continue;
      const target = path.resolve(fileURLToPath(new URL(`../../${directory}/`, import.meta.url)), match[2].split('#')[0]);
      if (path.dirname(target) === fileURLToPath(new URL('../../docs', import.meta.url))) {
        assert.equal(Number(match[1]), chapterNumbers.get(path.basename(target)), `${directory}/${file}: stale chapter number in ${match[0]}`);
      }
    }
  }
}
console.log('Twelve accessible six-tile summaries, semantic icons, reading order, source-backed case table and curriculum formatting passed.');
