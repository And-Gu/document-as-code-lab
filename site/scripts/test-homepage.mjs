import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';
import { parse as yaml } from 'yaml';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const home = parse(await read('../dist/index.html'));
function all(node, predicate) {
  return [ ...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => all(child, predicate)) ];
}
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const hasClass = (node, value) => attr(node, 'class')?.split(' ').includes(value);
const groups = all(home, node => hasClass(node, 'learning-path'));
assert.equal(groups.length, 4);
assert.equal(all(home, node => node.tagName === 'h1').length, 1);
const groupLinks = groups.map(group => all(group, node => node.tagName === 'a').map(node => attr(node, 'href')));
assert.deepEqual(groupLinks.map(links => links.length), [4, 5, 1, 1]);
assert.equal(new Set(groupLinks.flat()).size, 11);
assert.ok(!groupLinks.flat().some(link => /\/(12|13|14)-automation\//.test(link)));
assert.ok(!groupLinks.flat().some(link => link.includes('10-git-review')));
assert.ok(!groupLinks.flat().some(link => link.includes('quality-checks')));
assert.ok(groupLinks.flat().some(link => link.includes('10-publishing')));
assert.ok(groupLinks.flat().every(link => link.startsWith('/document-as-code-lab/chapters/')));
for (const id of ['concept', 'learning-path', 'working-lab', 'presentations']) assert.equal(all(home, node => attr(node, 'id') === id).length, 1);
const image = all(home, node => hasClass(node, 'home-art'))[0];
assert.ok(attr(image, 'src').endsWith('/information-workshop.jpg'));
assert.ok(attr(image, 'alt'));
assert.ok((await readFile(new URL('../../assets/illustrations/information-workshop.jpg', import.meta.url))).length > 10000);
for (const slug of ['information-model', 'information-value', 'lab-architecture']) {
  const definition = yaml(await read(`../../presentations/${slug}.yaml`));
  const slideCount = slug === 'lab-architecture' ? 9 : 10;
  assert.equal(definition.slides.length, slideCount);
  assert.equal(new Set(definition.slides.map(slide => slide.id)).size, slideCount);
  assert.ok(definition.slides.every(slide => slide.notes && slide.sources.length));
  const deck = parse(await read(`../dist/presentations/${slug}/index.html`));
  const notes = parse(await read(`../dist/presentations/${slug}/notes/index.html`));
  assert.equal(all(deck, node => node.tagName === 'section' && attr(node, 'aria-label')).length, slideCount);
  assert.equal(all(notes, node => node.tagName === 'section').length, slideCount);
  assert.ok(all(deck, node => attr(node, 'href') === `/document-as-code-lab/presentations/${slug}/notes/`).length);
  assert.ok(all(home, node => attr(node, 'href') === `/document-as-code-lab/presentations/${slug}/`).length);
  for (const slide of definition.slides) assert.ok(all(notes, node => attr(node, 'id') === slide.id).length);
  assert.doesNotMatch(definition.slides.map(slide => JSON.stringify(slide)).join(' '), /git (checkout|switch|commit|push)|issue → branch/i);
}
const original = parse(await read('../dist/presentations/document-as-code/index.html'));
assert.equal(all(original, node => node.tagName === 'section' && attr(node, 'aria-label')).length, 8);
console.log('Homepage groups cover all 11 chapters; two ten-slide packs, nine-slide architecture deck, notes, image, base paths, and original eight-slide deck passed.');
