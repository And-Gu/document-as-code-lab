# Roadmap

## 1. Establish the Tutorial

- Agree on audience and expected prior knowledge.
- Draft chapters 1 and 2 to introduce the approach and the GitHub workspace.
- Develop chapter 3's growth exercise using the recurring example.
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

Current status: Astro publishes all twelve chapters to GitHub Pages, with metadata and Git-history panels. Production deployment, navigation, images, and Mermaid rendering have been verified. Chapter 3 also has an interactive growth widget using committed history at build time; its saved charts remain historical snapshots. Extending this view into a combined work-tracking dashboard remains a next step. Chapters 1 and 2 have their first approved editions.

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

- Build a PDF book with readable print layout.
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
- Book and presentation tooling; Astro is selected for the website, and existing charts use Matplotlib.
- Microsoft account environment used for the portability exercise.
