import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import ts from 'typescript';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const output = new URL('../../build/dashboard-tests/', import.meta.url);
await mkdir(output, { recursive: true });
for (const name of ['config', 'types', 'github-api', 'metrics-api', 'snapshot-api']) {
  const source = await readFile(new URL(`../src/lib/dashboard/${name}.ts`, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");
  await writeFile(new URL(`${name}.mjs`, output), js);
}
const { GitHubApi, workflowState, normalizeCommit } = await import(new URL('github-api.mjs', output));
const { failed } = await import(new URL('types.mjs', output));
const { apiRoot } = await import(new URL('config.mjs', output));
const signal = new AbortController().signal;
const nativeFetch = globalThis.fetch;
try {
  globalThis.fetch = function () { assert.equal(this, globalThis, 'Native fetch must retain its browser receiver'); return Promise.resolve(new Response('[]')); };
  assert.equal((await new GitHubApi().commits(signal)).items.length, 0);
} finally { globalThis.fetch = nativeFetch; }
const issue = number => ({ number, title: `Issue ${number}`, html_url: `https://github.com/And-Gu/document-as-code-lab/issues/${number}`, updated_at: '2026-10-11T10:00:00Z', user: { login: 'reader' }, labels: [{ name: 'docs' }] });
const calls = [];
const api = new GitHubApi(async (url, options) => {
  calls.push(url);
  assert.equal(options.credentials, 'omit');
  assert.equal(options.headers.Authorization, undefined);
  return new Response(JSON.stringify(calls.length === 1 ? [issue(1), { ...issue(2), pull_request: {} }] : [issue(3)]), {
    headers: calls.length === 1 ? { link: `<${apiRoot}/issues?page=2>; rel="next"` } : {},
  });
});
const issues = await api.issues(signal);
assert.equal(calls.length, 2);
assert.equal(issues.total, 2);
assert.deepEqual(issues.items.map(item => item.id), ['1', '3']);
assert.deepEqual(issues.items[0].labels, ['docs']);
assert.equal(workflowState('completed', null), 'unknown');
assert.equal(workflowState('completed', 'failure'), 'failure');
assert.equal(workflowState('completed', 'success'), 'success');
assert.equal(workflowState('completed', 'cancelled'), 'cancelled');
assert.equal(workflowState('in_progress', null), 'running');
assert.equal(workflowState('queued', null), 'queued');
assert.equal(normalizeCommit({ sha: 'a'.repeat(40), html_url: 'https://github.com/a/b/commit/a', commit: { message: 'First line\nBody', author: { name: 'Writer', date: '2026-10-11T10:00:00Z' } } }).title, 'First line');
const stale = failed({ data: issues, retrievedAt: 'earlier', state: 'Live API' }, 'Offline');
assert.equal(stale.state, 'Stale'); assert.equal(stale.data.total, 2); assert.equal(stale.retrievedAt, 'earlier');
assert.equal(failed({ state: 'Loading' }, 'Offline').state, 'Unavailable');
const limited = new GitHubApi(async () => new Response('{}', { status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(Math.ceil(Date.now() / 1000) + 3600) } }));
await assert.rejects(limited.issues(signal), /rate limited/);
assert.ok(limited.pollingDelay() > 120000);
const offline = new GitHubApi(async () => { throw new TypeError('Offline'); });
await assert.rejects(offline.pulls(signal), /Offline/);
const failure = new GitHubApi(async () => new Response('{}', { status: 500 }));
await assert.rejects(failure.commits(signal), /500/);
const invalid = new GitHubApi(async () => new Response('{}'));
await assert.rejects(invalid.issues(signal), /Unexpected/);
console.log('Dashboard API pagination, normalization, workflow states, stale preservation, rate limits, and offline handling passed.');
const { parseMetrics, fetchMetrics, lagMessage } = await import(new URL('metrics-api.mjs', output));
const { projectMetrics } = await import('./metrics-schema.mjs');
const history = [{ source_commit: 'a'.repeat(40), committed_at: '2026-10-11T10:00:00Z', word_count: 40, chapter_count: 2, draft_or_complete_chapters: 1, complete_features: null }];
const metrics = projectMetrics({ measurement_version: 3, history }, '2026-10-11T11:00:00Z');
assert.deepEqual(parseMetrics(metrics), metrics);
assert.throws(() => parseMetrics({ ...metrics, schema_version: 2 }), /schema/);
assert.throws(() => parseMetrics({ ...metrics, source_commit: 'b'.repeat(40) }), /provenance/);
assert.throws(() => parseMetrics({ ...metrics, history: [{ ...history[0], word_count: -1 }] }), /count/);
assert.throws(() => parseMetrics({ ...metrics, generated_at: 'yesterday' }), /schema/);
assert.match(lagMessage(metrics.source_commit), /cannot be checked/);
assert.match(lagMessage(metrics.source_commit, metrics.source_commit), /matches/);
assert.match(lagMessage(metrics.source_commit, 'b'.repeat(40)), /differs/);
await fetchMetrics('/document-as-code-lab/data/project-metrics.json', signal, async (url, options) => {
  assert.equal(url, '/document-as-code-lab/data/project-metrics.json'); assert.equal(options.cache, 'no-store');
  return new Response(JSON.stringify(metrics));
});
await assert.rejects(fetchMetrics('/data.json', signal, async () => new Response('', { status: 404 })), /404/);
const generated = parseMetrics(JSON.parse(await readFile(new URL('../public/data/project-metrics.json', import.meta.url), 'utf8')));
assert.ok(generated.history.length > 1);
console.log('Versioned metrics generation, schema validation, provenance, lag, and base-path fetch passed.');
const { parseSnapshot, fetchSnapshot, snapshotKeys } = await import(new URL('snapshot-api.mjs', output));
const { repository } = await import(new URL('config.mjs', output));
const snapshot = { schema_version: 1, generated_at: '2026-10-11T11:00:00Z', source_commit: 'a'.repeat(40), repository,
  results: Object.fromEntries(snapshotKeys.map(key => [key, { state: 'Published snapshot', retrievedAt: '2026-10-11T11:00:00Z', data: issues }])) };
assert.deepEqual(parseSnapshot(snapshot), snapshot);
assert.throws(() => parseSnapshot({ ...snapshot, schema_version: 2 }), /provenance/);
assert.throws(() => parseSnapshot({ ...snapshot, repository: { ...repository, name: 'other' } }), /provenance/);
assert.throws(() => parseSnapshot({ ...snapshot, results: { ...snapshot.results, issues: { ...snapshot.results.issues, data: { ...issues, total: -1 } } } }), /collection/);
assert.equal(parseSnapshot({ ...snapshot, results: { ...snapshot.results, workflows: { state: 'Unavailable', error: 'Collection failed' } } }).results.workflows.state, 'Unavailable');
let snapshotCalls = 0;
await fetchSnapshot('/document-as-code-lab/data/project-operations.json', signal, async (url, options) => {
  snapshotCalls++; assert.equal(url, '/document-as-code-lab/data/project-operations.json'); assert.equal(options.credentials, 'omit');
  return new Response(JSON.stringify(snapshot));
});
assert.equal(snapshotCalls, 1);
await assert.rejects(fetchSnapshot('/snapshot.json', signal, async () => new Response('', { status: 503 })), /503/);
console.log('Operational snapshot provenance, partial failure, validation, and single static-file retrieval passed.');
const generator = new URL('./operational-snapshot.mjs', import.meta.url);
const fixtureOutput = new URL('generated-operations.json', output);
const collectorTest = `
  process.env.GITHUB_TOKEN = 'test-token-never-publish';
  process.argv = ['node', 'collector', '--output', ${JSON.stringify(fileURLToPath(fixtureOutput))}];
  globalThis.fetch = async (url, options) => {
    if (options.headers.Authorization !== 'Bearer test-token-never-publish') throw new Error('Missing collector authentication');
    if (url.includes('/pulls?')) return new Response('{}', { status: 503 });
    if (url.includes('/actions/workflows?')) return new Response(JSON.stringify({ workflows: [{ id: 42 }] }));
    if (url.includes('/actions/workflows/42/runs?')) return new Response(JSON.stringify({ workflow_runs: [{ id: 99, name: 'Test build', html_url: 'https://github.com/And-Gu/document-as-code-lab/actions/runs/99', status: 'completed', conclusion: 'failure', head_branch: 'main', updated_at: '2026-10-11T10:00:00Z' }] }));
    return new Response('[]');
  };
  await import(${JSON.stringify(generator.href)});
`;
execFileSync(process.execPath, ['--input-type=module', '-e', collectorTest], { stdio: 'pipe' });
const fixtureText = await readFile(fixtureOutput, 'utf8');
assert.ok(!fixtureText.includes('test-token-never-publish'));
const collected = parseSnapshot(JSON.parse(fixtureText));
assert.equal(collected.results.pulls.state, 'Unavailable');
assert.equal(collected.results.issues.data.total, 0);
assert.equal(collected.results.workflows.data.items[0].state, 'failure');
console.log('Authenticated build collector, partial-source failure, workflow conclusions, and credential exclusion passed.');
