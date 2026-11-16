import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { repositoryRoot } from './environment.mjs';
import { assertHostedIdentity } from './hosted-target.mjs';

export function checkoutState(root = repositoryRoot) {
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  return { revision: git(['rev-parse', 'HEAD']), dirty: Boolean(git(['status', '--porcelain'])) };
}

export function requireReleaseIdentity({ root = repositoryRoot, expected, directory = path.join(root, 'site/dist') } = {}) {
  const current = checkoutState(root);
  if (expected && current.revision !== expected) throw new Error('Checkout revision changed; reconcile the delivery revision before testing.');
  if (current.dirty) throw new Error('Release tests require a clean committed checkout. Use --preview with an explicit test file for working-tree UI checks.');
  const manifest = JSON.parse(readFileSync(path.join(directory, 'build-information.json'), 'utf8'));
  try { assertHostedIdentity(manifest, current.revision); }
  catch { throw new Error('Build revision is missing, stale or invalid. Build the clean committed checkout before release tests.'); }
  return manifest;
}
