import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as yaml } from 'yaml';

const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const slugs = (await readdir(new URL('../../docs/', import.meta.url))).filter(name => name.endsWith('.md'));
assert.equal(slugs.length, 13);
const numbers = [];
const chapterNumbers = new Map();
for (const file of slugs) {
  const source = await read(`../../docs/${file}`);
  const metadata = yaml(source.match(/^---\n([\s\S]*?)\n---/)[1]);
  numbers.push(metadata.chapter_number);
  chapterNumbers.set(file, metadata.chapter_number);
}
assert.deepEqual(numbers.sort((a,b) => a-b), Array.from({length:13},(_,index)=>index+1));
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
assert.match(readme, /^13\. \[Bringing It Together\]/m);
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
console.log('Reading order, chapter references, source-backed case table and curriculum formatting passed.');
