import { stat } from 'node:fs/promises';
import path from 'node:path';

export const architectureExamples = [
  {
    id: 'chapter', label: 'Chapter page',
    source: 'The original chapter text and metadata in docs/.',
    sources: ['docs/10-publishing.md'],
    transform: 'Astro reads the Markdown collection and renders the chapter, navigation, diagrams, and shared components.',
    processors: ['site/src/content.config.ts', 'site/src/pages/chapters/[slug].astro'],
    result: 'HTML, styles, and browser scripts served by GitHub Pages.',
    output: 'chapters/10-publishing/', outputLabel: 'Open chapter page',
    trigger: 'A push to main, manual deployment, or scheduled deployment rebuilds the website.',
    boundary: 'Editing the HTML output is not how we maintain the chapter. The Markdown stays authoritative.',
  },
  {
    id: 'contracts', label: 'Contract Explorer',
    source: 'Nine fictional Markdown records, their recorded relations, and an explicit schema.',
    sources: ['examples/contract-explorer/records/AMD-001.md', 'examples/contract-explorer/schema.json'],
    transform: 'Build-time validation derives a shared snapshot. Browser code provides relationship navigation, filters, and impact paths.',
    processors: ['site/src/lib/contract-loader.ts', 'site/src/lib/contract-controller.ts'],
    result: 'Three interactive views in Chapter 9, using the same maintained records.',
    output: 'chapters/09-images/#contract-explorer-widget', outputLabel: 'Open Contract Explorer',
    trigger: 'A source change reaches the published snapshot after a successful website rebuild and deployment.',
    boundary: 'Navigation is browser-time interaction. It does not change a record or write to the repository.',
  },
  {
    id: 'presentation', label: 'Presentation',
    source: 'A curated YAML deck with messages, notes, and chapter references.',
    sources: ['presentations/lab-architecture.yaml'],
    transform: 'Astro validates the deck and uses shared slide components. Reveal.js handles browser navigation and overview.',
    processors: ['site/src/lib/presentations.ts', 'site/src/layouts/PresentationLayout.astro'],
    result: 'Nine HTML slides and a separate speaker-notes page in the same website build.',
    output: 'presentations/lab-architecture/', outputLabel: 'Open architecture presentation',
    trigger: 'Rebuild and deploy after changing the YAML or its shared presentation code.',
    boundary: 'Chapter references provide traceability; they do not automatically rewrite the deck when a chapter changes.',
  },
  {
    id: 'dashboard', label: 'Project Control Center',
    source: 'Committed Git history and public GitHub observations collected during the build.',
    sources: ['scripts/measure_growth.py', 'site/scripts/operational-snapshot.mjs'],
    transform: 'The build generates growth data and an authenticated operational snapshot. The browser reads the published JSON.',
    processors: ['site/scripts/growth-report.mjs', 'site/src/lib/dashboard/controller.ts', '.github/workflows/deploy-pages.yml'],
    result: 'A dashboard with collection times and measured revisions, not an automatically live API feed.',
    output: 'dashboard/', outputLabel: 'Open Project Control Center',
    trigger: 'Push to main, manual deployment, or the hourly schedule. Scheduled runs can be delayed.',
    boundary: 'Fetch live data is a separate, opt-in browser API request. Automatic refresh reads the published snapshot, not the live API.',
  },
  {
    id: 'pdf', label: 'PDF design proof',
    source: 'Identified Markdown excerpts, diagram sources, and a PDF-specific layout template.',
    sources: ['publishing/pdf/README.md', 'publishing/pdf/template.typ'],
    transform: 'A separate runner renders Mermaid, builds the proof, verifies the output, and creates page images for review.',
    processors: ['scripts/build_pdf_proof.py', '.github/workflows/pdf-proof.yml'],
    result: 'A limited PDF and review images retained as workflow artifacts, not a Pages publication or full book.',
    output: 'https://github.com/And-Gu/document-as-code-lab/actions/workflows/pdf-proof.yml', outputLabel: 'Open proof workflow and artifacts',
    trigger: 'A pull request targeting main or a manual PDF proof run. Artifacts have limited retention.',
    boundary: 'Download the artifact from a successful run while retained. GitHub may require sign-in to download it.',
  },
];

export async function validateArchitectureSources(root: string, published: Set<string>, examples = architectureExamples) {
  const ids = new Set<string>();
  for (const example of examples) {
    if (ids.has(example.id)) throw new Error(`Duplicate architecture example: ${example.id}`);
    ids.add(example.id);
    for (const source of [...example.sources, ...example.processors]) {
      if (!published.has(source)) throw new Error(`Architecture source is not exposed: ${source}`);
      if (!(await stat(path.join(root, source))).isFile()) throw new Error(`Missing architecture source: ${source}`);
    }
  }
}
