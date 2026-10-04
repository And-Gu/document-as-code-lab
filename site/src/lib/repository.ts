import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const repositoryRoot = path.resolve(process.cwd(), '..');

export async function repositoryFiles() {
  const files = ['README.md', 'GLOSSARY.md', 'CONTRIBUTING.md', 'ROADMAP.md', 'requirements.txt', 'site/README.md'];
  const extensions = /\.(md|json|yaml|yml|py|mmd|png|svg|jpg|jpeg|webp|gif|txt)$/i;
  async function collect(directory: string) {
    const entries = await readdir(path.join(repositoryRoot, directory), { withFileTypes: true });
    for (const entry of entries) {
      const name = `${directory}/${entry.name}`;
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== '__pycache__') {
        await collect(name);
      } else if (entry.isFile() && extensions.test(entry.name)) {
        files.push(name);
      }
    }
  }
  for (const directory of ['docs', 'examples', 'reference', 'assets', 'data', 'scripts', '.github']) {
    await collect(directory);
  }
  return files;
}
