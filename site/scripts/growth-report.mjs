import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { projectMetrics } from './metrics-schema.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const localPython = `${root}.venv/bin/python`;
const python = process.env.PYTHON ?? (existsSync(localPython) ? localPython : 'python3');
const result = spawnSync(python, [
  `${root}scripts/measure_growth.py`, '--json-only', '--output', `${root}build/site-growth`,
], { cwd: root, stdio: 'inherit' });
if (result.error) console.error(result.error.message);
if (result.status !== 0) process.exit(result.status ?? 1);
const destination = new URL('../public/data/', import.meta.url);
mkdirSync(destination, { recursive: true });
const report = JSON.parse(readFileSync(`${root}build/site-growth/history.json`, 'utf8'));
writeFileSync(new URL('project-metrics.json', destination), JSON.stringify(projectMetrics(report)) + '\n');
