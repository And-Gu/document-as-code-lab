import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
// A dirty tree cannot truthfully identify its output by a committed source revision.
const root = new URL('../../', import.meta.url);
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const sourceCommit = git(['status', '--porcelain']) ? null : git(['rev-parse', 'HEAD']);
const target = new URL('../public/build-information.json', import.meta.url);
await mkdir(new URL('.', target), { recursive: true });
await writeFile(target, JSON.stringify({ schema_version: 1, source_commit: sourceCommit, built_at: new Date().toISOString() }, null, 2) + '\n');
console.log(sourceCommit ? `Build source: ${sourceCommit}` : 'Build source: uncommitted working tree (revision verification unavailable)');
