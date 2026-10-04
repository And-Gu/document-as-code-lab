import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../../', import.meta.url));
const localPython = `${root}.venv/bin/python`;
const python = process.env.PYTHON ?? (existsSync(localPython) ? localPython : 'python3');
const result = spawnSync(python, [
  `${root}scripts/measure_growth.py`, '--json-only', '--output', `${root}build/site-growth`,
], { cwd: root, stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
