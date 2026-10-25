# Document-as-Code Lab

A living tutorial and visualization lab: write in Markdown, track changes, and turn shared source material into a website, a PDF book, and presentations.

The project teaches document-as-code by applying it to itself. It also serves as a visualization showcase for experienced readers: repository content, metadata, relationships, and work history become inputs to charts, diagrams, and dashboards.

## Audience and next baseline

The intended v1.4 baseline is for professionals experienced in information work with Word, Excel, PDF and specialized business systems. It explores new ways to collaborate, automate repeated information work and use agents with traceable sources. No writing, engineering or developer background is required for the browser-first journey. Document-as-code is the concrete demonstration, not automatic integration or a requirement to replace existing tools.

Package 1 adds a direct Processing Lab entry, readable contract records, shared chapter navigation, mobile source/preview controls and page sharing metadata. Its implementation and final text/design are in review; the status below records the earlier published baseline. Packages 2 and 3 remain future work. See the [package specifications](spec/tutorial/working-methods-upgrade/README.md).

## Status

The v1.3 editorial update revises all 11 chapters, which remain in review. The owner accepted the representative writing samples and authorized publication; those decisions do not approve every revised chapter. The [Astro reading site is published on GitHub Pages](https://and-gu.github.io/document-as-code-lab/) and reads the original Markdown sources, including diagrams and linked examples. Every chapter has an expandable metadata and Git-history widget. Pull requests run Astro checks and a production build; pushes to `main` build and deploy the website.

A runnable onboarding showcase, historical growth reporting, structured-record processing, and record-to-Mermaid generation are also available. Growth reports are generated as GitHub Actions artifacts. Chapter 3 connects source history to traceability and links to the standalone dashboard. Saved growth charts remain fixed historical examples, while the dashboard adds an interactive report measured from committed history during each site build. The [Project Control Center is published on GitHub Pages](https://and-gu.github.io/document-as-code-lab/dashboard/), linked from the chapter menu. It reads published operational snapshots by default, generated on main deployments and hourly, with optional live retrieval and separately labelled growth measurements. Hosted snapshot retrieval, timestamps, issues, pull requests, commits, and all four workflows have been verified. Workflow states describe collection time rather than current live status. The full PDF book, a hands-on workshop deck, and verification of Microsoft-environment exercises remain future work. Chapter approval does not extend to other chapter drafts or fictional example procedures.

The grouped learning homepage links to the [presentation collection](https://and-gu.github.io/document-as-code-lab/presentations/). Two ten-slide packs cover the information model and its value, with separate speaker-note pages; the original eight-slide introduction is retained. The [YAML definitions and authoring notes](presentations/README.md) describe how Astro renders reusable slide components and Reveal.js provides navigation within the existing website build. A hands-on workshop deck remains future work.

## Read Locally

Run the Astro site from the repository root:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
cd site
npm ci
npm run dev
```

Open the local URL printed by Astro, using the `/document-as-code-lab/` base path. Changes to the original chapter files update the site; no duplicate chapter copies are maintained. See the [site README](site/README.md) for checks, build commands, and the GitHub Pages deployment flow.

Use Node 22.12 or newer and a full Git checkout. The site generates growth data with Python before starting or building. The separate [PDF design trial](publishing/pdf/README.md) has optional dependencies and does not run as part of the website build. A dedicated manual/pull-request workflow builds its three-page proof with Mermaid CLI and saves review artifacts. Automated rendering and all three pages were verified in GitHub Actions; this is not the full book or a published PDF edition.

## Quality Checks

Run the Python suite from the repository root with `.venv/bin/python -m unittest discover -s tests`. From `site/`, run `npm run check`, `npm run test:dashboard`, `node scripts/test-budget.mjs`, and `npm run build`. PDF-specific tests and visual checks are listed in the [PDF trial instructions](publishing/pdf/README.md). A successful build does not replace visual review or approve content.

## Explore the Showcase

Chapter 1 follows three [procedure source files](examples/onboarding-showcase/README.md) into an assembled [handbook review copy](assets/onboarding-showcase/handbook.md), a [training excerpt](assets/onboarding-showcase/training-excerpt.md), and a [review-status chart](assets/onboarding-showcase/review-status.png). The [generation script](scripts/build_onboarding_showcase.py) builds these views from the same sources.

These are fixed, fictional teaching examples, not operationally approved instructions or a finished publishing system. The handbook includes draft material, the training excerpt is not a slide deck, and the chart is not an interactive dashboard. Chapter 1 adds a browser-only comparison of source review states and handbook inclusion rules; it does not generate a handbook. Chapter 4 adds Markdown practice; chapter 5 adds schema validation in the editor. Chapter 7 extends that editor with cross-file checks and a build that generates a handbook review copy and a review queue. None of these simulations change the fixed source files or approve publications. All 11 chapters have short website-only quizzes. Detailed dashboard, visual, AI, publishing, and automation exercises remain in linked reference guides.

Chapter 9's [Contract Explorer](https://and-gu.github.io/document-as-code-lab/chapters/09-images/#contract-explorer-widget) uses nine fictional Markdown records for relationship navigation, delivery filtering, and change-impact review candidates. Source validation and transformation run during the Astro build; the widget does not query external services or edit the records. See the [source dataset](examples/contract-explorer/README.md).

## Learning Goals

- Structure and maintain reusable documentation.
- Process content and metadata into documents, dashboards, and selected AI context.
- Give language models relevant, traceable context.
- Measure project growth using Git history and GitHub data.
- Create diagrams, images, and dashboards.
- Adapt shared material to web, book, and presentation formats.
- Transfer these practices to lighter workflows using OneDrive, Word, and Copilot.

## Tutorial

Start with the [shared vocabulary](GLOSSARY.md) whenever a term is unfamiliar. Local exercises link to official Git setup and cloning guides; the tutorial focuses on using the resulting workspace.

Filename prefixes and `chapter_number` metadata give the current reading order. Stable `id` values may contain older numbers; they identify the same content across reorganizations, not its current position.

1. [Document-as-Code: Information We Can Work With](docs/01-introduction.md)
2. [A Shared Workspace for Information](docs/02-github-workspace.md)
3. [History Is Useful Information](docs/03-project-growth.md)
4. [Markdown: Readable Sources](docs/04-markdown.md)
5. [Structure Makes Information Actionable](docs/05-structured-content.md)
6. [Information Architecture and Traceability](docs/06-information-architecture.md)
7. [From Sources to Results](docs/07-processing.md)
8. [Making Information Usable by AI Agents](docs/08-ai-native.md)
9. [Information You Can Explore](docs/09-images.md)
10. [Automating Information with GitHub Actions](docs/10-publishing.md)
11. [Behind the Lab: How We Built This Tutorial](docs/11-beyond-github.md)

## Outputs

Chapters 10 and 11 explain the repository's workflows and architecture. Chapter 11 includes a read-only [Architecture Explorer](https://and-gu.github.io/document-as-code-lab/chapters/11-beyond-github/#architecture-explorer-widget) and a nine-slide [architecture presentation](https://and-gu.github.io/document-as-code-lab/presentations/lab-architecture/) with speaker notes. Both are included in the website build and Pages deployment; the chapter content remains in review.

| Output | Purpose |
| --- | --- |
| Website | Published tutorial with chapter metadata and history, a CSSV budget-table example, and the Project Control Center |
| PDF book | Coherent long-form reading |
| Presentations | Introduction, workshop, and technical deep dive |
| GitHub dashboard | Repository status, growth charts, and work tracking |
| Context packages | Selected source material for AI-assisted tasks |

Outputs share source material, but each needs appropriate structure and editorial choices. Presentation slides will not simply reproduce every paragraph of the book.

## Growth Tracking

Chapter 3 links to the Project Control Center, whose growth measurements are regenerated during website builds:

- Chapter count and word count, including per-chapter comparisons.
- Historical values reconstructed from Git revisions.
- Capability milestones from the versioned [feature register](data/features.json).
- Operational snapshots of GitHub issues, pull requests, commits, and workflow runs. GitHub Projects fields are not integrated into the dashboard.

Word counts measure content volume, not quality. The measurement rules distinguish substantive chapters from outlines and exclude generated files. Committed snapshots identify their source revision; optional working-copy measurements are labelled separately.

## Repository Layout

- `docs/`: tutorial chapters.
- `site/`: Astro reading site using the original chapters and supporting material.
- `presentations/`: selected teaching messages and chapter references for HTML slide decks.
- `publishing/pdf/`: optional PDF trial dependencies, Mermaid configuration, and Typst layout template.
- `reference/`: optional technical detail linked from chapters, excluded from chapter metrics.
- `examples/`: exercise sources and fixed showcase datasets, excluded from chapter metrics.
- `data/`: capability metadata and future measurement data.
- `assets/diagrams/`: editable diagram sources referenced by chapter visual metadata.
- `assets/figures/`: historical teaching charts and their measurement data.
- `assets/onboarding-showcase/`: generated handbook, training excerpt, chart, and source data.
- `scripts/`: historical measurement, content assembly, structured-record processing, and chart generation.
- `tests/`: focused growth measurement, structured-record processing, and diagram generation checks.
- `.github/workflows/`: growth reporting, Astro PR validation, and GitHub Pages deployment.
- `ROADMAP.md`: stages and completion criteria.
- `CONTRIBUTING.md`: writing and review conventions.
- `GLOSSARY.md`: shared definitions used across chapters.

Further publishing scripts and output-specific configuration will be added as the corresponding exercises are implemented.

## Tutorial Design

The [v1.3 specification register](spec/tutorial/README.md) links the reusable template, lab specification, original audit, and dated decisions. It records design intent separately from implementation and verification, including the [accepted editorial samples](spec/tutorial/V1-3-EDITORIAL-DECISIONS.md) and [chapter-by-chapter editorial review](spec/tutorial/EDITORIAL-REVIEW.md). The [project source map](reference/project-knowledge.md) locates authoritative rules and sources. In-context scenario checks in chapters 5, 6, and 8 complement the existing labs and quizzes without scoring or storing answers.

## Next Milestone

Review package 1 wording and rendered reader journeys, then merge its implementation before beginning package 2. Continue chapter review and track later output/environment work in the roadmap. Keep the capability register aligned with verification evidence.

## Licensing

Original software is licensed under MIT; original educational content is licensed under CC BY 4.0. See [LICENSE.md](LICENSE.md) for scope, attribution, and third-party exceptions.

The 11-chapter editorial structure keeps practical detail in [reference guides](reference/record-processing.md). The [dashboard guide](reference/dashboards-and-work-tracking.md) retains work tracking and the interactive budget table. Chapter 6 now covers architecture; processing is chapter 7. Earlier published chapter URLs have redirects in Astro.
