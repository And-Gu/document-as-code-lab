// Shared by the hosted scenario guard and its offline failure-path tests.
export function validateHostedTarget(env, head) {
  const { HOSTED_URL, EXPECTED_REVISION, DEPLOYMENT_RUN_ID } = env;
  if (!HOSTED_URL || !EXPECTED_REVISION || !DEPLOYMENT_RUN_ID) throw new Error('Provide HOSTED_URL, full EXPECTED_REVISION and DEPLOYMENT_RUN_ID. No deployment is started by this check.');
  const url = new URL(HOSTED_URL);
  if (url.username || url.password || url.search || url.hash || !url.pathname.endsWith('/document-as-code-lab/') || (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error('Use an explicit public HTTPS base URL ending in /document-as-code-lab/ (localhost allowed only for harness rehearsal).');
  if (!/^[a-f0-9]{40}$/.test(EXPECTED_REVISION)) throw new Error('EXPECTED_REVISION must be a full source commit.');
  if (head !== EXPECTED_REVISION) throw new Error('Check out EXPECTED_REVISION so verification uses the expected source.');
  return { url: url.href, revision: EXPECTED_REVISION, deployment_run: DEPLOYMENT_RUN_ID };
}

export function assertHostedIdentity(manifest, expected) {
  if (manifest?.source_commit !== expected) throw new Error('Revision mismatch/pending: a 200 response is not deployment evidence.');
  if (manifest.schema_version !== 1 || Object.keys(manifest).sort().join(',') !== 'built_at,schema_version,source_commit' || !Number.isFinite(Date.parse(manifest.built_at))) throw new Error('Invalid deployment identity manifest.');
}
