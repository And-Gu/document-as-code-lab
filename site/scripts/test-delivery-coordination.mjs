import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { repositoryRoot } from './environment.mjs';
import { requireReleaseIdentity } from './release-identity.mjs';
import { readDelivery, startDelivery, assignTask, claimTask, finishTask, checkBuildOwner, beginPhase, endPhase, formatDelivery } from './delivery-record.mjs';

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'delivery-coordination-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  await mkdir(path.join(root, 'site/tests/e2e'), { recursive: true });
  await mkdir(path.join(root, 'site/dist'), { recursive: true });
  await writeFile(path.join(root, '.gitignore'), 'build/\nsite/dist/\n');
  for (const name of ['graph', 'slides']) await writeFile(path.join(root, `site/tests/e2e/${name}.spec.ts`), '// fixture');
  git(['init', '-q']); git(['add', '.']); git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'Fixture']);
  const revision = git(['rev-parse', 'HEAD']), file = path.join(root, 'build/verification/delivery.json');
  await writeFile(path.join(root, 'site/dist/build-information.json'), JSON.stringify({ schema_version: 1, source_commit: revision, built_at: new Date().toISOString() }));
  return { root, file, git, revision };
}

test('release readiness rejects null/stale build identity, dirty files and a moved HEAD', async t => {
  const { root, revision, git } = await fixture(t);
  assert.equal(requireReleaseIdentity({ root, expected: revision }).source_commit, revision);
  const manifest = path.join(root, 'site/dist/build-information.json');
  for (const source_commit of [null, 'a'.repeat(40)]) {
    await writeFile(manifest, JSON.stringify({ schema_version: 1, source_commit, built_at: new Date().toISOString() }));
    assert.throws(() => requireReleaseIdentity({ root, expected: revision }), /Build revision/);
  }
  await writeFile(path.join(root, 'untracked.txt'), 'new source');
  assert.throws(() => requireReleaseIdentity({ root, expected: revision }), /clean committed/);
  git(['add', '.']); git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'Next']);
  assert.throws(() => requireReleaseIdentity({ root, expected: revision }), /Checkout revision changed/);
});

test('one delivery owner controls builders and rejects overlapping file ownership even with another grep', async t => {
  const { root, file } = await fixture(t);
  startDelivery(file, 'owner', root);
  assert.throws(() => startDelivery(file, 'another', root), /already owned/);
  assert.equal(checkBuildOwner(root, { DELIVERY_ACTOR: 'owner' }), 'owner');
  assert.throws(() => checkBuildOwner(root, { DELIVERY_ACTOR: 'another' }), /owner is owner/);
  const task = { name: 'graph', worker: 'reader', mode: 'hosted', target: 'https://example.org/document-as-code-lab/', files: ['graph.spec.ts'] };
  assignTask(file, 'owner', task, root);
  assert.throws(() => assignTask(file, 'another', { ...task, name: 'slides', files: ['slides.spec.ts'] }, root), /owner is owner/);
  assert.throws(() => assignTask(file, 'owner', { ...task, name: 'duplicate', grep: 'a different selection' }, root), /Overlapping/);
  assignTask(file, 'owner', { ...task, name: 'slides', files: ['slides.spec.ts'] }, root);
  assignTask(file, 'owner', { ...task, name: 'local-graph', mode: 'local', target: undefined }, root);
  assert.equal(Object.keys(readDelivery(file).tasks).length, 3, 'Local and hosted verification remain separate gates');
});

test('task claims bind actor, exact scope, revision and target; concurrent duplicate claims cannot both run', async t => {
  const { root, file, revision } = await fixture(t);
  startDelivery(file, 'owner', root);
  assignTask(file, 'owner', { name: 'slides', worker: 'reader', mode: 'local', preview: true, files: ['slides.spec.ts'] }, root);
  const task = readDelivery(file).tasks.slides;
  const input = { revision, hosted: false, scenarios: false, preview: true, args: task.args, runDirectory: '/evidence/one' };
  assert.throws(() => claimTask(file, 'other', 'slides', input), /another actor/);
  assert.throws(() => claimTask(file, 'reader', 'slides', { ...input, revision: 'a'.repeat(40) }), /revision changed/);
  assert.throws(() => claimTask(file, 'reader', 'slides', { ...input, args: ['graph.spec.ts'] }), /differs/);
  const module = pathToFileURL(path.join(repositoryRoot, 'site/scripts/delivery-record.mjs')).href;
  const source = `import { claimTask } from ${JSON.stringify(module)}; claimTask(${JSON.stringify(file)},'reader','slides',${JSON.stringify(input)});`;
  const attempts = await Promise.allSettled([1, 2].map(() => promisify(execFile)(process.execPath, ['--input-type=module', '-e', source])));
  assert.equal(attempts.filter(r => r.status === 'fulfilled').length, 1);
  finishTask(file, 'slides', 'passed');
  assert.throws(() => claimTask(file, 'reader', 'slides', input), /already started or completed/);
  assert.equal(readDelivery(file).tasks.slides.attempts.length, 1);
  const cli = path.join(repositoryRoot, 'site/scripts/delivery.mjs');
  const retry = reason => spawnSync(process.execPath, [cli, 'retry', '--actor', 'owner', '--task', 'slides', ...(reason ? ['--reason', reason] : [])], { env: { ...process.env, DELIVERY_RECORD: file }, encoding: 'utf8' });
  assert.equal(retry().status, 1, 'A repeat requires an explanation');
  assert.equal(retry('Changed test input').status, 0);
  claimTask(file, 'reader', 'slides', { ...input, runDirectory: '/evidence/two' });
  finishTask(file, 'slides', 'failed');
  assert.deepEqual(readDelivery(file).tasks.slides.attempts.map(a => a.status), ['passed', 'failed']);
  assignTask(file, 'owner', { name: 'live-slides', worker: 'reader', mode: 'hosted', files: ['slides.spec.ts'], target: 'https://example.org/document-as-code-lab/' }, root);
  const live = readDelivery(file).tasks['live-slides'];
  assert.throws(() => claimTask(file, 'reader', live.name, { revision, hosted: true, scenarios: true, preview: false, args: live.args, target: 'https://different.org/document-as-code-lab/' }), /differs/);
});

test('phase reports preserve failures, overlapping intervals and unknown milestones without adding their durations', async t => {
  const { root, file } = await fixture(t);
  startDelivery(file, 'owner', root);
  assert.throws(() => beginPhase(file, 'owner', 'ambiguous', '2026-11-16T08:00:00'), /explicit time zone/);
  beginPhase(file, 'owner', 'ci:web', '2026-11-16T08:00:00Z', 'https://example.org/run/1');
  beginPhase(file, 'owner', 'ci:pdf', '2026-11-16T08:00:01Z');
  assert.throws(() => endPhase(file, 'owner', 'ci:web', 'passed', '2026-11-16T07:59:00Z'), /after its start/);
  endPhase(file, 'owner', 'ci:web', 'failed', '2026-11-16T08:00:10Z');
  endPhase(file, 'owner', 'ci:pdf', 'passed', '2026-11-16T08:00:06Z');
  const record = readDelivery(file), report = formatDelivery(record);
  assert.deepEqual(record.phases.map(p => p.duration_ms), [10000, 5000]);
  assert.match(report, /requested: unknown/);
  assert.match(report, /ci:web \| failed \| 10.000 s/);
  assert.match(report, /not added together/);
  assert.doesNotMatch(report, /15.000 s/);
  const cli = path.join(repositoryRoot, 'site/scripts/delivery.mjs');
  const result = spawnSync(process.execPath, [cli, 'run', '--actor', 'owner', '--phase', 'failed-command', '--', process.execPath, '-e', 'process.exit(3)'], { env: { ...process.env, DELIVERY_RECORD: file }, encoding: 'utf8' });
  assert.equal(result.status, 3, result.stderr);
  assert.equal(readDelivery(file).phases.at(-1).status, 'failed');
  const handoff = spawnSync(process.execPath, [cli, 'handoff', '--actor', 'owner', '--owner', 'next-owner', '--reason', 'Shift change'], { env: { ...process.env, DELIVERY_RECORD: file }, encoding: 'utf8' });
  assert.equal(handoff.status, 0, handoff.stderr);
  assert.equal(readDelivery(file).owner, 'next-owner');
  assert.throws(() => beginPhase(file, 'owner', 'editing'), /owner is next-owner/);
});

test('independent phase writers wait for a short lock and preserve both updates', async t => {
  const { root, file } = await fixture(t);
  startDelivery(file, 'owner', root);
  await writeFile(`${file}.lock`, JSON.stringify({ pid: process.pid, fixture: true }));
  const module = pathToFileURL(path.join(repositoryRoot, 'site/scripts/delivery-record.mjs')).href;
  const writers = ['one', 'two'].map(name => promisify(execFile)(process.execPath, ['--input-type=module', '-e', `import { beginPhase } from ${JSON.stringify(module)}; beginPhase(${JSON.stringify(file)}, 'owner', '${name}');`]));
  await new Promise(resolve => setTimeout(resolve, 120));
  await rm(`${file}.lock`);
  await Promise.all(writers);
  assert.deepEqual(readDelivery(file).phases.map(p => p.name).sort(), ['one', 'two']);
});

test('a failed release preflight exits before snapshot, port selection or Playwright execution', async t => {
  const { root } = await fixture(t);
  const id = `release-preflight-test-${Date.now()}`;
  const output = path.join(repositoryRoot, 'build/verification/runs', id);
  t.after(() => rm(output, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [path.join(repositoryRoot, 'site/scripts/run-browser-tests.mjs'), '--project=chromium'], {
    env: { ...process.env, DELIVERY_RECORD: path.join(root, 'no-active-delivery.json'), TEST_RUN_ID: id, EXPECTED_REVISION: '0'.repeat(40) }, encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /FAIL release identity/);
  assert.doesNotMatch(result.stdout, /Running \d+ tests|Owned test port/);
  const record = JSON.parse(await readFile(path.join(output, 'run.json'), 'utf8'));
  assert.equal(record.status, 'failed');
  assert.deepEqual(record.phases.map(p => p.name), ['preflight', 'cleanup']);
  assert.equal(record.port, undefined);
  assert.equal(record.build_sha256, undefined);
});
