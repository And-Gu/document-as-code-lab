# Documentation Site

Astro reading site for the tutorial, with strict TypeScript configuration and npm.

The content collection reads chapters directly from `../docs/` and sorts them by `chapter_number`. Edit the original Markdown files to update the site. Routes use the chapter filenames, while existing stable content IDs remain unchanged in the sources.

The home page lists all chapters. Chapter pages include previous/next links, rendered images, and Mermaid diagrams. Linked Markdown examples, reference notes, and the glossary have reading pages under `/materials/`. Supporting files and original sources are available under `/files/` from an explicit selection of project folders.

The Project Control Center is available at `/document-as-code-lab/dashboard/`, linked from the chapter menu. By default it reads `public/data/project-operations.json`, an ignored, versioned snapshot of public GitHub issues, pull requests, main commits, and the latest run of each workflow. Configuration is in `src/lib/dashboard/config.ts`; presentation styles are in `src/styles/dashboard.css`. Collection follows pagination links (with a 20-page safety budget); exceeding that budget reports unavailable data rather than an incomplete total. Lists show up to ten matches, while the workflow list shows every retrieved workflow. Activity is a limited feed of the retrieved items.

The Pages workflow generates the snapshot using its read-only `GITHUB_TOKEN` during the build, then publishes the JSON with the site. Deployments run after pushes to main, manually, and hourly at minute 17. Scheduled runs and CDN updates may be delayed. Snapshot generation time, source revision, and per-source retrieval times are visible. Workflow states describe collection time, so the deploying workflow itself may still be running. There are no data commits or updates to chapter Markdown. GitHub may disable scheduled workflows in inactive public repositories; check Actions if updates stop.

Opening the dashboard, Refresh snapshot, and five-minute visible-tab refreshes read only the published JSON. Fetch live data explicitly calls the anonymous GitHub API once; it does not start API polling. Each source retains its last successful in-memory result on failure. The browser never receives a token. Refresh snapshot also reloads growth measurements. Without `GITHUB_TOKEN`, local builds reuse an existing snapshot or create an explicitly unavailable placeholder without contacting GitHub. To reproduce collection locally, provide a suitably scoped token through the environment and run `node scripts/operational-snapshot.mjs`; never put credentials into source files or public assets.

The growth hook also generates ignored `public/data/project-metrics.json`, schema version 1, using the existing Python measurement rules. It includes generation time, the measured source revision and its commit time, and committed history. The browser fetches this file with `cache: no-store`, labels it Measured snapshot, and compares it with the retrieved main commit. New measurements become available after a site deployment; they do not update from live API calls. A future independent dataset publisher would need to serve JSON at a public URL with the same schema. Actions artifacts alone are not that public endpoint. Chapter 3 retains its existing educational widget.

Dashboard verification: `npm run test:dashboard` checks API normalization, pagination, failures, workflow states, generated schema, provenance, and subpath fetching. It also runs in the Astro pull-request workflow. For browser failure testing of the production build, `node scripts/dashboard-test-server.mjs` serves an isolated test harness on port 4327 with network fault controls; those controls are never included in the deployed build.

HTML slide decks are listed under `/presentations/`. YAML in `../presentations/` selects messages and links to the maintained chapters. Four Astro slide components render that content; Reveal.js provides presentation behavior within the same build and deployment. See the [presentation authoring notes](../presentations/README.md) for the format and verification steps. The dedicated theme is `src/styles/presentations.css`.

Chapter 10's `<!-- interactive: budget-table -->` marker mounts `BudgetTable.astro`. It bundles the official `@rhpaiva/cssv` 0.5.0 renderer (MIT) and reads `examples/dashboards/department-budget.cssv` at build time. The file supplies data and table CSS; `src/styles/budget-table.css` styles the surrounding controls. Our component adds sorting, filtering, and totals, not cell editing or formula evaluation. Only reviewed repository content is loaded. The Markdown table remains as a no-JavaScript/error fallback; keep its values synchronized with the example file. No third-party CDN is required.

From the repository root:

The growth widget also needs Python and the repository's measurement dependencies. Set up `.venv` and install `requirements.txt` as described in chapter 3. The npm pre-dev and pre-build hooks use that environment when available, otherwise `python3`; set `PYTHON` to override the executable. Full Git history is required.

```bash
cd site
npm ci
npm run dev
```

Check and build:

```bash
npm run check
npm run build
node scripts/test-budget.mjs
```

Astro requires Node 22.12 or newer. This project includes Node 22 as a local development dependency, so npm scripts use a compatible runtime even when the system Node version is older. No global Node installation is changed.

Pull requests against `main` run `.github/workflows/astro-pr-check.yml`, which installs dependencies with `npm ci`, checks types, and builds the site. Pushes to `main` run `.github/workflows/deploy-pages.yml`, which builds and publishes to [GitHub Pages](https://and-gu.github.io/document-as-code-lab/). Required review and build checks must be configured separately in GitHub's branch rules.

The configured base path is `/document-as-code-lab/`, including for local development. Build output is written to `dist/` and is not committed. The chapter information widget reads metadata from the sources and chapter-specific history from Git at build time; CI checks out full history for this purpose. Its appearance is controlled by `src/styles/chapter-information.css`.

Chapter 3's `<!-- interactive: project-growth -->` marker places the interactive growth view before its historical charts. `scripts/growth-report.mjs` runs the existing Python measurement with `--json-only` before development and production builds. The report stays under ignored `build/site-growth/`; only committed revisions are included. Restart the dev server after a new commit to regenerate it. `ProjectGrowth.astro` renders the Chart.js view, with CSS in `src/styles/project-growth.css`. Without JavaScript, readers can still use the chapter's historical examples.

Example passages can be enclosed by standalone `<!-- example:start onboarding -->` and `<!-- example:end onboarding -->` comments, with blank lines around each marker. Use a matching descriptive identifier for each pair; nesting is not supported. These comments are invisible in GitHub's Markdown preview. Astro wraps the content in `.tutorial-example[data-example="onboarding"]`, styled by `src/styles/tutorial-examples.css`. Set `--example-accent` and `--example-background` there to change the colors, or use the data attribute to target one example. Keep a visible example heading in the Markdown so its meaning does not depend on color.

Renumbered chapter URLs have static redirects configured in `astro.config.mjs`. These preserve existing website links while Markdown filenames and navigation follow the new reading order. Chapters 5 and 6 separate templates and metadata from processing; optional processing experiments are in `reference/record-processing.md`.
