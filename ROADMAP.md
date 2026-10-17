# Roadmap

## 1. Establish the Tutorial

- Agree on audience and expected prior knowledge.
- Draft chapters 1 and 2 to introduce the approach and the GitHub workspace.
- Keep history and traceability in chapter 3, with the actual dashboard linked. Detailed dashboard and measurement material lives in the reference guides.
- Define chapter status, chapter counting, word counting, and capability milestones.
- Keep this README aligned with implemented behavior.

Done when the introduction and growth exercise can be followed by a reader.

## 2. Measure the Project

- Implement historical metrics from Git revisions.
- Record source commit, measurement version, and chapter status.
- Generate initial charts from the same dataset.
- Run measurements on changes to main.
- Avoid automated output commits triggering repeated builds.

Done when an update produces verifiable current and historical metrics.

## 3. Publish the First Website

Published baseline: Astro publishes the tutorial to GitHub Pages, with metadata and Git-history panels. Production deployment, navigation, images, and Mermaid rendering have been verified. Chapter 3 introduces the standalone Project Control Center, whose growth widget uses committed history at build time. Saved charts under `assets/figures/` remain historical snapshots. The CSSV budget table with sorting and filtering is retained in the dashboard reference guide. The Project Control Center is published at `/dashboard/` with authenticated, build-generated operational snapshots on main deployment and an hourly schedule; optional live retrieval remains available. Pages deployment 38152410515 verified all four operational sources, workflow states, source revision, and generation timestamps. Workflow states describe collection time, and scheduled runs may be delayed. The editorial structure contains 14 chapters: chapters 1 and 2 are approved, and the remaining 12 are in review. Full-book generation and several interactive exercises remain future work.

- Compare a small set of publishing tools against the tutorial's needs.
- Publish chapters and a basic growth dashboard.
- Check links, navigation, accessibility, and diagram rendering.

Done when readers can follow the first exercises online.

## 4. Expand the Learning Material

- Draft Markdown, AI context, visual assets, collaboration, and dashboard chapters.
- Compare Mermaid, SVG, raster assets, and Napkin.
- Set up GitHub Projects for work tracking.

Done when exercises use the project's own content and data.

## 5. Add Book and Presentations

The first HTML introduction deck uses YAML, reusable Astro components, and Reveal.js in the existing site build. Local production checks cover its eight slides, source links, navigation, overview, fullscreen, and desktop/phone layouts. The workshop deck and book remain to be developed; this does not yet meet the presentation capability's two-deck completion criterion.

- Build a PDF book with readable print layout.
- Expand the verified Pandoc/Typst three-excerpt proof and automated Mermaid rendering to full-book navigation, pagination, and accessibility checks. See `publishing/pdf/README.md` and the proposed chapter outline in `reference/pdf-publication.md`.
- Build an introduction deck and a workshop deck.
- Document how edits in Word or PowerPoint return to the source.
- Verify shared diagrams in each output.

Done when all outputs can be regenerated from documented inputs.

## 6. Explore Beyond GitHub

- Develop a lightweight OneDrive and Copilot exercise.
- Verify capabilities in the chosen Microsoft environment.
- Document source ownership, review, context selection, and version history.
- Compare manual and automated workflows.

Done when readers can adapt the practices without relying on GitHub.

## Open Decisions

- Primary audience and assumed technical knowledge.
- Whether the Pandoc/Typst book trial meets full-publication needs; Astro with Reveal.js is selected for HTML presentations, and existing charts use Matplotlib.
- Microsoft account environment used for the portability exercise.
