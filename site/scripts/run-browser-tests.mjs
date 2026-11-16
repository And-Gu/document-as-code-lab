import { readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { repositoryRoot, siteRoot } from './environment.mjs';
import { preflight, printChecks } from './preflight.mjs';
import { availablePort, createRun, snapshotBuild } from './test-run.mjs';

const args = process.argv.slice(2);
const hosted = args.includes('--hosted');
const scenarios = args.includes('--scenarios');
const forwarded = args.filter(arg => !['--hosted', '--scenarios'].includes(arg));
const browsers = forwarded.flatMap((arg, i) => arg.startsWith('--project=') ? [arg.slice(10)] : arg === '--project' ? [forwarded[i + 1]] : []);
const listing = forwarded.includes('--list');
let directory;
let metadata;
try {
  if (scenarios && (!hosted || !forwarded.some(arg => /\.spec\.[cm]?[jt]s$/.test(arg)))) throw new Error('Use --scenarios with hosted verification and an explicit .spec.ts file.');
  if (!listing && !printChecks(await preflight({ profile: hosted ? 'hosted' : 'browser', browsers: browsers.length ? browsers : hosted ? ['chromium'] : ['chromium', 'firefox', 'webkit'] }))) process.exit(1);
  directory = await createRun(path.join(repositoryRoot, 'build/verification/runs'), process.env.TEST_RUN_ID);
  const env = { ...process.env, TEST_RUN_DIR: directory, HOSTED_SCENARIOS: scenarios ? '1' : '0' };
  metadata = {
    started_at: new Date().toISOString(), mode: hosted ? 'hosted' : 'local', scenarios, args: forwarded, status: 'running',
    checkout: repositoryRoot, node: process.version,
    source_commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
    working_tree_dirty: Boolean(execFileSync('git', ['status', '--porcelain'], { cwd: repositoryRoot, encoding: 'utf8' }).trim()),
    ...(hosted ? { target: process.env.HOSTED_URL, expected_revision: process.env.EXPECTED_REVISION, deployment_run: process.env.DEPLOYMENT_RUN_ID } : {}),
  };
  if (!hosted && !listing) {
    env.TEST_SITE_ROOT = path.join(directory, 'site');
    metadata.build_sha256 = await snapshotBuild(path.join(siteRoot, 'dist'), env.TEST_SITE_ROOT);
    metadata.build = JSON.parse(await readFile(path.join(env.TEST_SITE_ROOT, 'build-information.json'), 'utf8'));
    env.E2E_PORT = String(await availablePort(process.env.E2E_PORT));
    metadata.port = Number(env.E2E_PORT);
  }
  await writeFile(path.join(directory, 'run.json'), JSON.stringify(metadata, null, 2) + '\n');
  console.log(`Test evidence: ${directory}${metadata.port ? ` (port ${metadata.port})` : ''}`);
  const child = spawn(process.execPath, [path.join(siteRoot, 'node_modules/@playwright/test/cli.js'), 'test', ...(hosted ? ['--config=playwright.hosted.config.ts'] : []), ...forwarded], { cwd: siteRoot, env, stdio: 'inherit' });
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => child.kill(signal));
  const code = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', (status, signal) => resolve(signal ? 1 : status ?? 1)); });
  metadata.status = listing ? (code === 0 ? 'listed' : 'failed') : (code === 0 ? 'passed' : 'failed');
  metadata.exit_code = code;
  process.exitCode = code;
} catch (error) {
  console.error(error.message);
  metadata = { ...metadata, status: 'failed', error: error.message };
  process.exitCode = 1;
} finally {
  if (directory) {
    await writeFile(path.join(directory, 'run.json'), JSON.stringify({ ...metadata, finished_at: new Date().toISOString() }, null, 2) + '\n');
    // Retain reports/traces/screenshots, but do not upload an entire site per run.
    await rm(path.join(directory, 'site'), { recursive: true, force: true });
  }
}
