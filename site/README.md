# Documentation Site

Astro reading site for the tutorial, with strict TypeScript configuration and npm.

The content collection reads chapters directly from `../docs/` and sorts them by `chapter_number`. Edit the original Markdown files to update the site. Routes use the chapter filenames, while existing stable content IDs remain unchanged in the sources.

The home page lists all chapters. Chapter pages include previous/next links, rendered images, and Mermaid diagrams. Linked Markdown examples, reference notes, and the glossary have reading pages under `/materials/`. Supporting files and original sources are available under `/files/` from an explicit selection of project folders.

HTML slide decks are listed under `/presentations/`. YAML in `../presentations/` selects messages and links to the maintained chapters. Four Astro slide components render that content; Reveal.js provides presentation behavior within the same build and deployment. See the [presentation authoring notes](../presentations/README.md) for the format and verification steps. The dedicated theme is `src/styles/presentations.css`.

From the repository root:

The growth widget also needs Python and the repository's measurement dependencies. Set up `.venv` and install `requirements.txt` as described in chapter 3. The npm pre-dev and pre-build hooks use that environment when available, otherwise `python3`; set `PYTHON` to override the executable. Full Git history is required.

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

Chapter 3's `<!-- interactive: project-growth -->` marker places the interactive growth view before its historical charts. `scripts/growth-report.mjs` runs the existing Python measurement with `--json-only` before development and production builds. The report stays under ignored `build/site-growth/`; only committed revisions are included. Restart the dev server after a new commit to regenerate it. `ProjectGrowth.astro` renders the Chart.js view, with CSS in `src/styles/project-growth.css`. Without JavaScript, readers can still use the chapter's historical examples.

Example passages can be enclosed by standalone `<!-- example:start onboarding -->` and `<!-- example:end onboarding -->` comments, with blank lines around each marker. Use a matching descriptive identifier for each pair; nesting is not supported. These comments are invisible in GitHub's Markdown preview. Astro wraps the content in `.tutorial-example[data-example="onboarding"]`, styled by `src/styles/tutorial-examples.css`. Set `--example-accent` and `--example-background` there to change the colors, or use the data attribute to target one example. Keep a visible example heading in the Markdown so its meaning does not depend on color.
