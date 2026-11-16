import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
export const siteRoot = path.join(repositoryRoot, 'site');
export function pythonCommand(root = repositoryRoot, env = process.env) {
  const local = path.join(root, '.venv/bin/python');
  const command = env.PYTHON || (existsSync(local) ? local : 'python3');
  return command.includes('/') ? path.resolve(root, command) : command;
}
