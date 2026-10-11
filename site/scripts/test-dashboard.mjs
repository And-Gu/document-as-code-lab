import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import ts from 'typescript';

const output = new URL('../../build/dashboard-tests/', import.meta.url);
await mkdir(output, { recursive: true });
for (const name of ['config', 'types', 'github-api', 'metrics-api']) {
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
