import { appendFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const hostedBase = 'https://and-gu.github.io/document-as-code-lab/';
const revisionPattern = /^[a-f0-9]{40}$/;
const snapshotKeys = ['issues', 'pulls', 'commits', 'workflows'];

function validTime(value, label) {
  const timestamp = typeof value === 'string' ? Date.parse(value) : NaN;
  if (!Number.isFinite(timestamp)) throw new Error(label + ' is missing or invalid');
  return timestamp;
}

export function checkPublication({ manifest, snapshot, dashboard, expectedRevision, buildStartedAt, now = Date.now() }) {
  if (!revisionPattern.test(expectedRevision)) throw new Error('Expected revision must be a full Git commit SHA');
  const started = validTime(buildStartedAt, 'Build start time');
  const built = validTime(manifest?.built_at, 'Build timestamp');
  const generated = validTime(snapshot?.generated_at, 'Snapshot timestamp');
  if (manifest?.schema_version !== 1 || manifest.source_commit !== expectedRevision) {
    throw new Error('Build manifest revision/schema does not match the deployment');
  }
  if (snapshot?.schema_version !== 1 || snapshot.source_commit !== expectedRevision) {
    throw new Error('Dashboard snapshot revision/schema does not match the deployment');
  }
  // Same SHA is used across hourly runs. Check timestamps against *this* build.
  if (built < started || generated < started || generated < built) {
    throw new Error('Published data belongs to an earlier build (stale CDN or deployment)');
  }
  if (built > now + 60_000 || generated > now + 60_000) {
    throw new Error('Published timestamps are unexpectedly in the future');
  }
  const repo = snapshot?.repository;
  if (repo?.owner !== 'And-Gu' || repo.name !== 'document-as-code-lab' || repo.branch !== 'main') {
    throw new Error('Dashboard snapshot has incorrect repository provenance');
  }
  if (!snapshot.results || !snapshotKeys.every(key =>
    ['Published snapshot', 'Unavailable'].includes(snapshot.results[key]?.state))) {
    throw new Error('Dashboard snapshot is missing required data-source states');
  }
  if (!snapshotKeys.some(key => snapshot.results[key].state === 'Published snapshot')) {
    throw new Error('Dashboard snapshot contains no successfully collected source');
  }
  if (typeof dashboard !== 'string' || !dashboard.includes('<h1>Project Control Center</h1>')) {
    throw new Error('Published dashboard route is missing its expected heading');
  }
  return { revision: expectedRevision, built_at: manifest.built_at, snapshot_at: snapshot.generated_at };
}

async function request(fetcher, url, type) {
  const response = await fetcher(url, { cache: 'no-store', signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(url.pathname + ': HTTP ' + response.status);
  if (type === 'html') {
    if (!response.headers.get('content-type')?.includes('text/html')) {
      throw new Error(url.pathname + ': expected HTML');
    }
    return response.text();
  }
  return response.json();
}

export async function verifyScheduledPublication({
  expectedRevision, buildStartedAt, deploymentRunId, fetcher = fetch,
  attempts = 12, delayMs = 3_000, now = () => Date.now(),
  base = hostedBase,
}) {
  if (base !== hostedBase) throw new Error('Scheduled verification must target the published GitHub Pages URL');
  if (!revisionPattern.test(expectedRevision)) throw new Error('Invalid expected revision');
  validTime(buildStartedAt, 'Build start time');
  let failure;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const nonce = (deploymentRunId ?? 'manual') + '-' + attempt + '-' + now();
      const url = path => new URL(path + '?verification=' + encodeURIComponent(nonce), base);
      const [manifest, snapshot, dashboard] = await Promise.all([
        request(fetcher, url('build-information.json'), 'json'),
        request(fetcher, url('data/project-operations.json'), 'json'),
        request(fetcher, url('dashboard/'), 'html'),
      ]);
      const result = checkPublication({ manifest, snapshot, dashboard, expectedRevision, buildStartedAt, now: now() });
      return { ...result, attempts: attempt };
    } catch (error) {
      failure = error;
      console.warn('Scheduled publication verification ' + attempt + '/' + attempts + ': ' + error.message);
      if (attempt < attempts) await sleep(delayMs);
    }
  }
  throw new Error('Published dashboard could not be verified after ' + attempts + ' attempts: ' + failure?.message);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const report = await verifyScheduledPublication({
      expectedRevision: process.env.EXPECTED_REVISION,
      buildStartedAt: process.env.BUILD_STARTED_AT,
      deploymentRunId: process.env.DEPLOYMENT_RUN_ID,
    });
    console.log('Verified scheduled publication: ' + report.revision + ', snapshot ' + report.snapshot_at +
      ' (' + report.attempts + ' attempt(s))');
    if (process.env.GITHUB_STEP_SUMMARY) {
      await appendFile(process.env.GITHUB_STEP_SUMMARY, [
        '### Scheduled Pages verification',
        '',
        'Revision: ' + report.revision,
        'Build: ' + report.built_at,
        'Snapshot: ' + report.snapshot_at,
        'Attempts: ' + report.attempts,
        '',
      ].join('\n'));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
