import { readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { repositoryRoot, siteRoot } from './environment.mjs';
import { preflight, printChecks } from './preflight.mjs';
import { availablePort, createRun, snapshotBuild } from './test-run.mjs';
import { checkoutState, requireReleaseIdentity } from './release-identity.mjs';
import { readDelivery, recordPath, claimTask, finishTask } from './delivery-record.mjs';

const args = process.argv.slice(2);
const hosted = args.includes('--hosted');
const scenarios = args.includes('--scenarios');
const preview = args.includes('--preview');
const forwarded = args.filter(arg => !['--hosted', '--scenarios', '--preview'].includes(arg));
const browsers = forwarded.flatMap((arg, i) => arg.startsWith('--project=') ? [arg.slice(10)] : arg === '--project' ? [forwarded[i + 1]] : []);
const listing = forwarded.includes('--list');
let directory;
let metadata;
let claimed;
const deliveryFile = recordPath();
const phase = async (name, work) => {
  const entry = { name, started_at: new Date().toISOString(), status: 'running' }, started = performance.now();
  metadata.phases.push(entry);
  try { const result = await work(); entry.status = 'passed'; return result; }
  catch (error) { entry.status = 'failed'; throw error; }
  finally {
    entry.finished_at = new Date().toISOString(); entry.duration_ms = Math.round((performance.now() - started) * 1000) / 1000;
    await writeFile(path.join(directory, 'run.json'), JSON.stringify(metadata, null, 2) + '\n');
  }
};
try {
  if (scenarios && (!hosted || !forwarded.some(arg => /\.spec\.[cm]?[jt]s$/.test(arg)))) throw new Error('Use --scenarios with hosted verification and an explicit .spec.ts file.');
  if (preview && (hosted || process.env.CI || !forwarded.some(arg => /\.spec\.[cm]?[jt]s$/.test(arg)))) throw new Error('--preview requires an explicit local test file and is unavailable in CI or hosted verification.');
  directory = await createRun(path.join(repositoryRoot, 'build/verification/runs'), process.env.TEST_RUN_ID);
  const env = { ...process.env, TEST_RUN_DIR: directory, HOSTED_SCENARIOS: scenarios ? '1' : '0' };
  metadata = {
    started_at: new Date().toISOString(), mode: hosted ? 'hosted' : 'local', scenarios, preview, args: forwarded, status: 'running', phases: [],
    checkout: repositoryRoot, node: process.version,
    source_commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
    working_tree_dirty: Boolean(execFileSync('git', ['status', '--porcelain'], { cwd: repositoryRoot, encoding: 'utf8' }).trim()),
    ...(hosted ? { target: process.env.HOSTED_URL, expected_revision: process.env.EXPECTED_REVISION, deployment_run: process.env.DEPLOYMENT_RUN_ID } : {}),
  };
  console.log(`Test evidence: ${directory}`);
  if (!listing) {
    const delivery = readDelivery(deliveryFile);
    if (delivery && !delivery.closed_at) {
      claimed = claimTask(deliveryFile, process.env.DELIVERY_ACTOR, process.env.DELIVERY_TASK, { revision: metadata.source_commit, hosted, scenarios, preview, args: forwarded, target: hosted ? process.env.HOSTED_URL : undefined, runDirectory: directory });
      metadata.delivery = claimed;
    }
    await phase('preflight', async () => {
      if (!printChecks(await preflight({ profile: hosted ? 'hosted' : preview ? 'browser' : 'release', expectedRevision: process.env.EXPECTED_REVISION || metadata.source_commit, browsers: browsers.length ? browsers : hosted ? ['chromium'] : ['chromium', 'firefox', 'webkit'] }))) throw new Error('Preflight failed; no browser was started.');
    });
  }
  if (!hosted && !listing) {
    env.TEST_SITE_ROOT = path.join(directory, 'site');
    metadata.build_sha256 = await phase('snapshot', () => snapshotBuild(path.join(siteRoot, 'dist'), env.TEST_SITE_ROOT));
    metadata.build = JSON.parse(await readFile(path.join(env.TEST_SITE_ROOT, 'build-information.json'), 'utf8'));
    if (!preview) requireReleaseIdentity({ expected: metadata.source_commit, directory: env.TEST_SITE_ROOT });
    env.E2E_PORT = String(await availablePort(process.env.E2E_PORT));
    metadata.port = Number(env.E2E_PORT);
  }
  await writeFile(path.join(directory, 'run.json'), JSON.stringify(metadata, null, 2) + '\n');
  if (metadata.port) console.log(`Owned test port: ${metadata.port}`);
  const code = await phase(listing ? 'discovery' : 'browser', async () => {
    const child = spawn(process.execPath, [path.join(siteRoot, 'node_modules/@playwright/test/cli.js'), 'test', ...(hosted ? ['--config=playwright.hosted.config.ts'] : []), ...forwarded], { cwd: siteRoot, env, stdio: 'inherit' });
    for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => child.kill(signal));
    const result = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', (status, signal) => resolve(signal ? 1 : status ?? 1)); });
    if (result !== 0) throw new Error(`Playwright exited ${result}; see this run's retained evidence.`);
    return result;
  });
  if (!listing) await phase('checkout-after', () => {
    if (checkoutState().revision !== metadata.source_commit) throw new Error('Checkout changed during testing; results remain attached to the starting revision.');
    if (!hosted && !preview) requireReleaseIdentity({ expected: metadata.source_commit, directory: env.TEST_SITE_ROOT });
  });
  metadata.status = listing ? (code === 0 ? 'listed' : 'failed') : (code === 0 ? 'passed' : 'failed');
  metadata.exit_code = code;
  process.exitCode = code;
} catch (error) {
  console.error(error.message);
  metadata = { phases: [], ...metadata, status: 'failed', exit_code: 1, error: error.message };
  process.exitCode = 1;
} finally {
  if (directory) {
    try { await phase('cleanup', () => rm(path.join(directory, 'site'), { recursive: true, force: true })); }
    catch (error) { metadata.status = 'failed'; metadata.error = error.message; metadata.exit_code = 1; process.exitCode = 1; }
    await writeFile(path.join(directory, 'run.json'), JSON.stringify({ ...metadata, finished_at: new Date().toISOString() }, null, 2) + '\n');
    if (claimed) finishTask(deliveryFile, claimed.task, metadata.status);
  }
}
