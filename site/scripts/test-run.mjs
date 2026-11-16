import { mkdir, readdir, readFile, cp } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import path from 'node:path';

export async function createRun(parent, id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(id)) throw new Error('TEST_RUN_ID must be 1–100 letters, digits, underscores or hyphens');
  await mkdir(parent, { recursive: true });
  const directory = path.join(parent, id);
  await mkdir(directory); // Never reuse a run, including after a failed test.
  return directory;
}

export async function fingerprint(directory) {
  const hash = createHash('sha256');
  async function visit(relative = '') {
    const entries = await readdir(path.join(directory, relative), { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) await visit(name);
      else if (entry.isFile()) {
        const bytes = await readFile(path.join(directory, name));
        hash.update(JSON.stringify([name, bytes.length]));
        hash.update(bytes);
      } else throw new Error(`Build snapshot cannot contain links or special files: ${name}`);
    }
  }
  await visit();
  return hash.digest('hex');
}

export async function snapshotBuild(source, destination) {
  const before = await fingerprint(source);
  await cp(source, destination, { recursive: true, errorOnExist: true, force: false });
  if (before !== await fingerprint(destination) || before !== await fingerprint(source)) {
    throw new Error('Build changed while capturing the test snapshot. Finish the build, then start a new test run.');
  }
  return before;
}

export async function availablePort(requested) {
  const port = requested === undefined ? 0 : Number(requested);
  if (!Number.isInteger(port) || port < 0 || port > 65535 || (requested !== undefined && port === 0)) throw new Error('E2E_PORT must be an integer from 1 to 65535');
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(port, '127.0.0.1', () => {
      const assigned = probe.address().port;
      probe.close(error => error ? reject(error) : resolve(assigned));
    });
  });
}
