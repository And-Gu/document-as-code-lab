import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import ts from 'typescript';

const output = new URL('../../build/dashboard-snapshot/', import.meta.url);
await mkdir(output, { recursive: true });
for (const name of ['config', 'types', 'github-api', 'snapshot-api']) {
  const source = await readFile(new URL(`../src/lib/dashboard/${name}.ts`, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");
  await writeFile(new URL(`${name}.mjs`, output), js);
}
const { GitHubApi } = await import(new URL('github-api.mjs', output));
const { repository } = await import(new URL('config.mjs', output));
const { snapshotKeys, parseSnapshot } = await import(new URL('snapshot-api.mjs', output));
const { values } = parseArgs({ args: process.argv.slice(2), options: { output: { type: 'string' } } });
const target = values.output ? pathToFileURL(resolve(values.output)) : new URL('../public/data/project-operations.json', import.meta.url);
const token = process.env.GITHUB_TOKEN;
if (!token) {
  try { await access(target); console.log('Using existing local operational snapshot.'); process.exit(0); } catch {}
}
const api = new GitHubApi((url, options) => fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } }));
const results = {};
for (const key of snapshotKeys) {
  if (!token) { results[key] = { state: 'Unavailable', error: 'No local snapshot. Authenticated snapshots are generated during Pages deployment.' }; continue; }
  try {
    results[key] = { data: await api[key](AbortSignal.timeout(60000)), retrievedAt: new Date().toISOString(), state: 'Published snapshot' };
  } catch {
    // Do not publish request headers, tokens, or raw API error responses.
    results[key] = { state: 'Unavailable', error: 'Snapshot collection failed. Check the deployment logs and retry.' };
    console.error(`Operational snapshot collection failed: ${key}`);
  }
}
if (token && snapshotKeys.every(key => results[key].state === 'Unavailable')) throw new Error('All operational snapshot sources failed');
const snapshot = parseSnapshot({ schema_version: 1, generated_at: new Date().toISOString(), source_commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: new URL('../../', import.meta.url), encoding: 'utf8' }).trim(), repository, results });
await mkdir(new URL('./', target), { recursive: true });
await writeFile(target, JSON.stringify(snapshot, null, 2) + '\n');
console.log('Generated operational snapshot (credentials excluded).');
