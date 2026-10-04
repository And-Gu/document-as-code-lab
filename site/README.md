# Documentation Site

Astro reading site for the tutorial, with strict TypeScript configuration and npm.

The content collection reads chapters directly from `../docs/` and sorts them by `chapter_number`. Edit the original Markdown files to update the site. Routes use the chapter filenames, while existing stable content IDs remain unchanged in the sources.

The home page lists all chapters. Chapter pages include previous/next links, rendered images, and Mermaid diagrams. Linked Markdown examples, reference notes, and the glossary have reading pages under `/materials/`. Supporting files and original sources are available under `/files/` from an explicit selection of project folders.

From the repository root:

```bash
cd site
npm install
npm run dev
```

Check and build:

```bash
npm run check
npm run build
```

Astro requires Node 22.12 or newer. This project includes Node 22 as a local development dependency, so npm scripts use a compatible runtime even when the system Node version is older. No global Node installation is changed.

Pull requests against `main` run `.github/workflows/astro-pr-check.yml`, which installs dependencies with `npm ci`, checks types, and builds the site. Pushes to `main` run `.github/workflows/deploy-pages.yml`, which builds and publishes to [GitHub Pages](https://and-gu.github.io/document-as-code-lab/). Required review and build checks must be configured separately in GitHub's branch rules.

The configured base path is `/document-as-code-lab/`, including for local development. Build output is written to `dist/` and is not committed. The chapter information widget reads metadata from the sources and chapter-specific history from Git at build time; CI checks out full history for this purpose. Its appearance is controlled by `src/styles/chapter-information.css`.
