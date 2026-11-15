import assert from 'node:assert/strict';
import { checkPublication, verifyScheduledPublication } from './verify-scheduled-publication.mjs';

const revision = 'a'.repeat(40);
const startedAt = '2026-11-15T10:00:00Z';
const builtAt = '2026-11-15T10:00:09Z';
const snapshotAt = '2026-11-15T10:00:14Z';
const now = () => Date.parse('2026-11-15T10:01:00Z');
const manifest = { schema_version: 1, source_commit: revision, built_at: builtAt };
const snapshot = {
  schema_version: 1, source_commit: revision, generated_at: snapshotAt,
  repository: { owner: 'And-Gu', name: 'document-as-code-lab', branch: 'main' },
  results: {
    issues: { state: 'Published snapshot' }, pulls: { state: 'Published snapshot' },
    commits: { state: 'Unavailable', error: 'Source unavailable' },
    workflows: { state: 'Published snapshot' },
  },
};
const dashboard = '<!doctype html><html><body><h1>Project Control Center</h1></body></html>';
const inputs = { manifest, snapshot, dashboard, expectedRevision: revision, buildStartedAt: startedAt, now: now() };
assert.equal(checkPublication(inputs).revision, revision);
assert.throws(() => checkPublication({ ...inputs, manifest: { ...manifest, source_commit: 'b'.repeat(40) } }), /revision\/schema/);
assert.throws(() => checkPublication({ ...inputs, manifest: { ...manifest, built_at: '2026-11-15T09:59:59Z' } }), /earlier build/);
assert.throws(() => checkPublication({ ...inputs, snapshot: { ...snapshot, generated_at: '2026-11-15T10:00:08Z' } }), /earlier build/);
assert.throws(() => checkPublication({ ...inputs, snapshot: { ...snapshot, results: {} } }), /data-source states/);
assert.throws(() => checkPublication({ ...inputs, dashboard: '<h1>Not Found</h1>' }), /dashboard route/);

function fakeFetcher({ staleFirst = false, brokenDashboard = false } = {}) {
  return async (requestUrl, { signal }) => {
    assert.ok(signal, 'requests must have timeouts');
    const url = new URL(requestUrl);
    assert.match(url.search, /verification=/);
    const stale = staleFirst && url.searchParams.get('verification').includes('-1-');
    if (url.pathname.endsWith('/build-information.json')) {
      return Response.json(stale ? { ...manifest, built_at: '2026-11-15T09:59:59Z' } : manifest);
    }
    if (url.pathname.endsWith('/data/project-operations.json')) return Response.json(snapshot);
    if (url.pathname.endsWith('/dashboard/')) {
      return new Response(brokenDashboard ? 'missing' : dashboard,
        { status: brokenDashboard ? 404 : 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
    throw new Error('Unexpected fetch URL');
  };
}
const params = { expectedRevision: revision, buildStartedAt: startedAt, deploymentRunId: 'test-run', now, delayMs: 0 };
const success = await verifyScheduledPublication({ ...params, fetcher: fakeFetcher(), attempts: 1 });
assert.equal(success.attempts, 1);
const retried = await verifyScheduledPublication({ ...params, fetcher: fakeFetcher({ staleFirst: true }), attempts: 2 });
assert.equal(retried.attempts, 2);
await assert.rejects(verifyScheduledPublication({ ...params, fetcher: fakeFetcher({ brokenDashboard: true }), attempts: 1 }), /could not be verified/);
console.log('Scheduled verification: revision, freshness, snapshot states, dashboard and CDN retry tests passed.');
