import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse } from 'yaml';
import { buildCacheKey, fingerprintPaths } from '../src/lib/incremental-build.mjs';

const root = await mkdtemp(path.join(tmpdir(), 'astro-incremental-'));
try {
  await mkdir(path.join(root, 'examples', 'nested'), { recursive: true });
  await writeFile(path.join(root, 'examples', 'nested', 'fixture.md'), 'First version');
  const first = await fingerprintPaths(root, ['examples']);
  assert.equal(first, await fingerprintPaths(root, ['examples']), 'Same source bytes must give the same key');

  await writeFile(path.join(root, 'examples', 'nested', 'fixture.md'), 'Changed version');
  const changed = await fingerprintPaths(root, ['examples']);
  assert.notEqual(changed, first, 'Modified fixture must invalidate the cache');

  await writeFile(path.join(root, 'examples', 'additional.json'), '{}');
  const added = await fingerprintPaths(root, ['examples']);
  assert.notEqual(added, changed, 'Added fixture must invalidate the cache');

  await rm(path.join(root, 'examples', 'additional.json'));
  assert.equal(await fingerprintPaths(root, ['examples']), changed, 'Removing the added fixture restores the original fingerprint');

  await assert.rejects(fingerprintPaths(root, ['../outside']), /escapes repository/);
  assert.equal(buildCacheKey('chapter', 'content', 'menu'), buildCacheKey('chapter', 'content', 'menu'));
  assert.notEqual(buildCacheKey('chapter', 'content', 'menu'), buildCacheKey('chapter', 'new content', 'menu'));
  assert.notEqual(buildCacheKey('chapter', 'content', 'menu'), buildCacheKey('chapter', 'content', 'new menu'));
  assert.notEqual(buildCacheKey('chapter', 'content', 'menu'), buildCacheKey('chapter', 'content', 'menu', 'example update'));
} finally {
  await rm(root, { recursive: true, force: true });
}

const file = name => readFile(new URL(name, import.meta.url), 'utf8');
const config = await file('../astro.config.mjs');
assert.ok(config.includes('experimental: { incrementalBuild: true }'));
for (const route of [
  '../src/pages/chapters/[slug].astro',
  '../src/pages/materials/[...slug].astro',
  '../src/pages/presentations/[slug].astro',
  '../src/pages/presentations/[slug]/notes.astro',
  '../src/pages/files/[...path].ts',
]) {
  assert.match(await file(route), /cacheKey:/, `${route} must opt in to incremental page output`);
}
const deploy = await file('../../.github/workflows/deploy-pages.yml');
const steps = parse(deploy).jobs.build.steps;
const install = steps.findIndex(step => step.run === 'npm ci');
const cache = steps.findIndex(step => step.with?.path === 'site/node_modules/.astro');
const clean = steps.findIndex(step => step.run?.includes('git status --porcelain'));
const build = steps.findIndex(step => step.run === 'npm run build -- --timings');
const upload = steps.findIndex(step => step.uses?.startsWith('actions/upload-pages-artifact@'));
assert.ok(install >= 0 && install < cache, 'Install locked dependencies before restoring the Astro cache');
assert.ok(cache < clean && clean < build && build < upload, 'Require a clean checkout before building and uploading');
assert.equal(steps[cache].with['restore-keys'], 'astro-cache-${{ runner.os }}-');
assert.equal(steps[upload].with.path, 'site/dist', 'Publish the complete built site');
console.log('Incremental cache key invalidation, opt-in routes and Pages cache configuration passed.');
