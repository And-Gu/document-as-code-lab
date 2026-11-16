import { accessSync, constants, existsSync, readFileSync, realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { repositoryRoot, pythonCommand } from './environment.mjs';
import { requireReleaseIdentity } from './release-identity.mjs';
import { checkBuildOwner } from './delivery-record.mjs';

// Read-only and dependency-free, so setup failures are reported before a build.
export async function preflight({ root = repositoryRoot, profile = 'build', browsers = ['chromium'], env = process.env, expectedRevision } = {}) {
  if (!['build', 'browser', 'release', 'hosted'].includes(profile)) throw new Error(`Unknown preflight profile: ${profile}`);
  const checks = [];
  const check = async (name, remedy, inspect) => {
    try { checks.push({ name, ok: true, detail: String(await inspect()) }); }
    catch (error) { checks.push({ name, ok: false, detail: error.message, remedy }); }
  };
  const readJSON = file => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
  const command = (executable, args) => {
    const result = spawnSync(executable, args, { cwd: root, env, encoding: 'utf8', timeout: 10000 });
    if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr.trim() || `${executable} exited ${result.status}`);
    return result.stdout.trim();
  };
  if (profile === 'build') await check('delivery owner', 'Read delivery report and use DELIVERY_ACTOR for the recorded owner; arrange an explicit handoff when needed.', () => checkBuildOwner(root, env));
  if (profile === 'release') await check('release identity', 'Commit when authorized, build the clean intended revision, then rerun. For targeted working-tree checks use --preview with a test file.', () => requireReleaseIdentity({ root, expected: expectedRevision }).source_commit);
  await check('repository', 'Run this script from a complete Git checkout; fetch missing history with git fetch --unshallow if needed.', () => {
    const actual = command('git', ['rev-parse', '--show-toplevel']);
    if (realpathSync(actual) !== realpathSync(root)) throw new Error(`Expected repository at ${root}`);
    if (profile === 'build' && command('git', ['rev-parse', '--is-shallow-repository']) === 'true') throw new Error('Builds need full history for chapter provenance and growth measurements');
    return actual;
  });
  await check('Node', 'Select the version in .node-version before running npm commands.', () => {
    const expected = readFileSync(path.join(root, '.node-version'), 'utf8').trim();
    const parts = value => value.split('.').map(Number);
    const actual = parts(process.versions.node), minimum = parts(expected);
    if (actual[0] !== minimum[0] || actual[1] < minimum[1] || (actual[1] === minimum[1] && actual[2] < minimum[2])) {
      throw new Error(`Node ${process.versions.node}; need ${expected} or a later patch/minor in the same major`);
    }
    return process.versions.node;
  });
  await check('npm', 'Use npm 11 with the selected Node runtime.', () => {
    const version = command('npm', ['--version']);
    if (!version.startsWith('11.')) throw new Error(`npm ${version}; need npm 11`);
    return version;
  });
  await check('locked dependencies', 'From site/: npm ci. Do not use npm install to repair a release checkout.', () => {
    const pkg = readJSON('site/package.json'), lock = readJSON('site/package-lock.json');
    for (const group of ['dependencies', 'devDependencies', 'engines']) {
      if (JSON.stringify(pkg[group]) !== JSON.stringify(lock.packages[''][group])) throw new Error(`package.json and lockfile disagree on ${group}`);
    }
    for (const name of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) {
      const installed = readJSON(`site/node_modules/${name}/package.json`).version;
      if (installed !== lock.packages[`node_modules/${name}`]?.version) throw new Error(`${name}: installed version differs from lockfile`);
    }
    return 'manifest, lockfile and installed direct dependencies agree';
  });
  if (profile === 'build') await check('Python', 'At repository root: python3 -m venv .venv && .venv/bin/python -m pip install -r requirements.txt; or set PYTHON to an existing interpreter.', () => {
    const expected = readFileSync(path.join(root, 'requirements.txt'), 'utf8').trim().split('\n').filter(line => line && !line.startsWith('#'));
    const script = 'import sys, json, importlib.metadata as m; print(json.dumps({"version": list(sys.version_info[:3]), "packages": {n: m.version(n) for n in ["PyYAML", "matplotlib"]}}))';
    const python = pythonCommand(root, env), found = JSON.parse(command(python, ['-c', script]));
    if (found.version[0] !== 3 || found.version[1] < 9) throw new Error('Python 3.9+ is required; CI uses 3.11');
    for (const requirement of expected) {
      const [name, version] = requirement.split('==');
      if (found.packages[name] !== version) throw new Error(`${name}: need ${version}, found ${found.packages[name] ?? 'missing'}`);
    }
    return `${python} (${found.version.join('.')}); required packages available`;
  });
  await check('output paths', 'Make this checkout writable; use a separate checkout for simultaneous builds.', () => {
    for (const relative of ['build/verification/runs', 'site/public', 'site/dist']) {
      let parent = path.join(root, relative);
      while (!existsSync(parent) && parent !== path.dirname(parent)) parent = path.dirname(parent);
      accessSync(parent, constants.W_OK);
    }
    return 'output parents are writable';
  });
  if (profile === 'browser' || profile === 'release') await check('production build', 'From site/: npm run build. Start tests after the build finishes.', () => {
    const manifest = readJSON('site/dist/build-information.json');
    if (manifest.schema_version !== 1 || !Number.isFinite(Date.parse(manifest.built_at))) throw new Error('Invalid build-information.json');
    accessSync(path.join(root, 'site/dist/index.html'), constants.R_OK);
    return `${manifest.source_commit ?? 'uncommitted preview (the production revision check requires commit + rebuild)'} built ${manifest.built_at}`;
  });
  if (profile !== 'build') await check('browser engines', `From site/: npx playwright install ${browsers.join(' ')} (Linux CI: add --with-deps).`, async () => {
    const playwright = await import(pathToFileURL(path.join(root, 'site/node_modules/playwright/index.mjs')).href);
    for (const browser of browsers) {
      if (!['chromium', 'firefox', 'webkit'].includes(browser)) throw new Error(`Unknown browser: ${browser}`);
      accessSync(playwright[browser].executablePath(), constants.X_OK);
    }
    return browsers.join(', ');
  });
  return checks;
}

export function printChecks(checks) {
  for (const item of checks) console.log(`${item.ok ? 'OK' : 'FAIL'} ${item.name}: ${item.detail}${item.ok ? '' : `\n  Fix: ${item.remedy}`}`);
  return checks.every(item => item.ok);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { process.exitCode = printChecks(await preflight({ profile: process.argv[2] || 'build', expectedRevision: process.env.EXPECTED_REVISION })) ? 0 : 1; }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
