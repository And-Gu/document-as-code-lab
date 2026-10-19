import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const repositoryRoot = path.resolve(process.cwd(), '..');

export async function repositoryFiles() {
  const files = ['README.md', 'LICENSE.md', 'AGENTS.md', 'GLOSSARY.md', 'CONTRIBUTING.md', 'ROADMAP.md', 'requirements.txt', 'site/README.md', 'tests/test_records.py',
    'site/src/content.config.ts', 'site/src/pages/chapters/[slug].astro',
    'site/src/lib/contract-loader.ts', 'site/src/lib/contract-controller.ts',
    'site/src/lib/presentations.ts', 'site/src/layouts/PresentationLayout.astro',
    'site/scripts/growth-report.mjs', 'site/scripts/operational-snapshot.mjs',
    'site/src/lib/dashboard/controller.ts'];
  const extensions = /\.(md|json|yaml|yml|py|mmd|png|svg|jpg|jpeg|webp|gif|txt|cssv|typ)$/i;
  async function collect(directory: string) {
    const entries = await readdir(path.join(repositoryRoot, directory), { withFileTypes: true });
    for (const entry of entries) {
      const name = `${directory}/${entry.name}`;
      if (entry.isDirectory() && !entry.name.startsWith('.') && !['__pycache__', 'node_modules'].includes(entry.name)) {
        await collect(name);
      } else if (entry.isFile() && extensions.test(entry.name)) {
        files.push(name);
      }
    }
  }
  for (const directory of ['docs', 'examples', 'reference', 'assets', 'data', 'scripts', 'presentations', 'publishing', 'spec', '.github']) {
    await collect(directory);
  }
  return files;
}
