import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, rename, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';
import { preflight } from './preflight.mjs';
import { repositoryRoot, pythonCommand } from './environment.mjs';
import { createRun, snapshotBuild, availablePort } from './test-run.mjs';
import { classify, changedFiles, impactFromGit } from './ci-impact.mjs';
import { validateHostedTarget, assertHostedIdentity } from './hosted-target.mjs';

test('shared hosted scenarios require an explicit target and the checked-out source revision', () => {
  const revision = 'a'.repeat(40);
  const env = { HOSTED_URL: 'https://example.org/document-as-code-lab/', EXPECTED_REVISION: revision, DEPLOYMENT_RUN_ID: '123' };
  assert.equal(validateHostedTarget(env, revision).revision, revision);
  for (const key of Object.keys(env)) assert.throws(() => validateHostedTarget({ ...env, [key]: '' }, revision));
  assert.throws(() => validateHostedTarget(env, 'b'.repeat(40)), /Check out/);
  for (const url of ['http://example.org/document-as-code-lab/', 'https://example.org/', 'https://user:pass@example.org/document-as-code-lab/', env.HOSTED_URL + '?x=1']) {
    assert.throws(() => validateHostedTarget({ ...env, HOSTED_URL: url }, revision));
  }
  const manifest = { schema_version: 1, source_commit: revision, built_at: '2026-11-16T07:00:00Z' };
  assert.doesNotThrow(() => assertHostedIdentity(manifest, revision));
  for (const wrong of [undefined, {}, { ...manifest, source_commit: null }, { ...manifest, source_commit: 'b'.repeat(40) }, { ...manifest, built_at: 'unknown' }, { ...manifest, extra: true }]) {
    assert.throws(() => assertHostedIdentity(wrong, revision));
  }
});

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'delivery-tooling-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test('preflight aggregates setup faults without creating output or installing anything', async t => {
  const root = await fixture(t);
  await mkdir(path.join(root, 'site'));
  await writeFile(path.join(root, '.node-version'), '24.22.2\n');
  await writeFile(path.join(root, 'requirements.txt'), 'PyYAML==6.0.3\nmatplotlib==3.9.4\n');
  const checks = await preflight({ root, env: { ...process.env, PYTHON: path.join(root, 'missing-python') } });
  for (const name of ['repository', 'locked dependencies', 'Python']) {
    const failure = checks.find(item => item.name === name);
    assert.equal(failure.ok, false, name);
    assert.ok(failure.remedy);
  }
  await assert.rejects(access(path.join(root, 'site/node_modules')));
  await assert.rejects(access(path.join(root, 'build')));
  await assert.rejects(preflight({ profile: 'typo' }), /Unknown preflight profile/);
});

test('the standalone preflight resolves its checkout from any working directory', async t => {
  const outside = await fixture(t);
  const result = spawnSync(process.execPath, [path.join(repositoryRoot, 'site/scripts/preflight.mjs'), 'hosted'], { cwd: outside, encoding: 'utf8' });
  // Browser availability may differ; repository/dependency discovery must not.
  assert.match(result.stdout, /OK repository:/);
  assert.match(result.stdout, /OK locked dependencies:/);
  assert.doesNotMatch(result.stdout, /FAIL (repository|locked dependencies):/);
  assert.equal(pythonCommand(repositoryRoot, { PYTHON: '.venv/bin/python' }), path.join(repositoryRoot, '.venv/bin/python'));
});

test('simultaneous runs have exclusive output directories and cannot erase older evidence', async t => {
  const root = await fixture(t);
  const [first, second] = await Promise.all([createRun(root), createRun(root)]);
  assert.notEqual(first, second);
  await writeFile(path.join(first, 'results.json'), 'first run evidence');
  await assert.rejects(createRun(root, path.basename(first)), { code: 'EEXIST' });
  assert.equal(await readFile(path.join(first, 'results.json'), 'utf8'), 'first run evidence');
  await assert.rejects(createRun(root, '../outside'), /TEST_RUN_ID/);
});

test('a test snapshot remains stable after the source build changes', async t => {
  const root = await fixture(t), source = path.join(root, 'dist'), target = path.join(root, 'snapshot');
  await mkdir(source);
  await writeFile(path.join(source, 'index.html'), 'reviewed build');
  assert.match(await snapshotBuild(source, target), /^[a-f0-9]{64}$/);
  await writeFile(path.join(source, 'index.html'), 'next build');
  assert.equal(await readFile(path.join(target, 'index.html'), 'utf8'), 'reviewed build');
  await assert.rejects(snapshotBuild(source, target));
});

test('port selection refuses an occupied port and validates explicit overrides', async t => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  await assert.rejects(availablePort(String(server.address().port)), { code: 'EADDRINUSE' });
  await assert.rejects(availablePort('0'), /E2E_PORT/);
  await assert.rejects(availablePort('banana'), /E2E_PORT/);
  assert.ok(await availablePort() > 0);
});

test('impact follows content consumers and shared inputs, not file extensions alone', () => {
  const slides = classify(['site/src/components/slides/RelationshipDiagram.tsx']);
  assert.equal(slides.browser_args, 'presentations.spec.ts journeys.spec.ts');
  assert.equal(slides.pdf, false);
  assert.equal(classify(['site/src/styles/chapter-information.css']).browser, 'all');
  for (const file of ['docs/01-introduction.md', 'reference/dashboards-and-work-tracking.md', 'examples/dashboards/department-budget.cssv', 'assets/diagrams/01-source-to-outcomes.mmd', 'publishing/pdf/template.typ', 'site/package-lock.json', '.github/workflows/pdf-proof.yml', 'new-unknown-input.xyz']) {
    const result = classify([file]);
    assert.equal(result.browser, 'all', file);
    assert.equal(result.pdf, true, file);
  }
  assert.equal(classify(['presentations/information-model.yaml', 'docs/05-structured-content.md']).pdf, true);
  assert.equal(classify([]).pdf, true);
  assert.throws(() => classify(['anything'], { version: 2 }), /Invalid CI impact map/);
});

test('Git impact includes both sides of a rename, dirty edits and untracked files; missing history broadens checks', async t => {
  const root = await fixture(t);
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git(['init', '-q']);
  await mkdir(path.join(root, 'docs'));
  await writeFile(path.join(root, 'docs/chapter.md'), 'Maintained source');
  git(['add', '.']); git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'Base']);
  const base = git(['rev-parse', 'HEAD']);
  await mkdir(path.join(root, 'presentations'));
  await rename(path.join(root, 'docs/chapter.md'), path.join(root, 'presentations/moved.md'));
  git(['add', '-A']); git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'Move source']);
  const moved = changedFiles({ root, base });
  assert.deepEqual(moved, ['docs/chapter.md', 'presentations/moved.md']);
  assert.equal(classify(moved).pdf, true);
  await writeFile(path.join(root, 'presentations/moved.md'), 'Uncommitted change');
  await writeFile(path.join(root, 'unknown.txt'), 'Untracked input');
  assert.deepEqual(changedFiles({ root, base: 'HEAD', workingTree: true }), ['presentations/moved.md', 'unknown.txt']);
  assert.equal(impactFromGit({ root, base: 'unavailable-branch' }).pdf, true);
  const shallow = path.join(await fixture(t), 'checkout');
  git(['clone', '--quiet', '--depth=1', pathToFileURL(root).href, shallow]);
  const shallowChecks = await preflight({ root: shallow });
  assert.match(shallowChecks.find(item => item.name === 'repository').detail, /full history/);
});

test('CI keeps existing gate names and always starts PR checks', async () => {
  const read = file => readFile(path.join(repositoryRoot, file), 'utf8');
  const web = parse(await read('.github/workflows/astro-pr-check.yml'));
  const pdf = parse(await read('.github/workflows/pdf-proof.yml'));
  assert.equal(web.jobs.build.name, 'Astro production build');
  assert.equal(pdf.jobs.proof.name, 'Render Mermaid and build PDF proof');
  for (const workflow of [web, pdf]) {
    assert.equal(workflow.on.pull_request.paths, undefined);
    assert.equal(workflow.on.pull_request['paths-ignore'], undefined);
    assert.equal(workflow.jobs[workflow === web ? 'build' : 'proof'].if, undefined);
  }
  for (const run of ['npm run check', 'npm run build -- --timings', 'npm run test:incremental', 'npm run test:tooling']) {
    assert.ok(web.jobs.build.steps.some(step => step.run === run && !step.if), run);
  }
  assert.ok(pdf.jobs.proof.steps.some(step => step.run === 'node site/scripts/ci-impact.mjs --ci' && !step.if));
});

test('manual workflow events select full verification and produce safe Actions outputs', async t => {
  const root = await fixture(t);
  const event = path.join(root, 'event.json'), output = path.join(root, 'output'), summary = path.join(root, 'summary');
  await writeFile(event, '{}');
  const result = spawnSync(process.execPath, [path.join(repositoryRoot, 'site/scripts/ci-impact.mjs'), '--ci'], {
    cwd: root, encoding: 'utf8',
    env: { ...process.env, GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_EVENT_PATH: event, GITHUB_OUTPUT: output, GITHUB_STEP_SUMMARY: summary },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).browser, 'all');
  assert.equal(await readFile(output, 'utf8'), 'browser_args=\npdf=true\n');
  assert.match(await readFile(summary, 'utf8'), /Explicit full run or non-PR event/);
});
