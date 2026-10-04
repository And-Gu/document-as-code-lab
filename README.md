# Document-as-Code Lab

A living tutorial and visualization lab: write in Markdown, track changes, and turn shared source material into a website, a PDF book, and presentations.

The project teaches document-as-code by applying it to itself. It also serves as a visualization showcase for experienced readers: repository content, metadata, relationships, and work history become inputs to charts, diagrams, and dashboards.

## Status

All 12 chapters now have a first draft. A runnable onboarding showcase, local growth reporting, structured-record processing, and record-to-Mermaid generation are available, with a GitHub Actions workflow for growth reports. Chapters 9 through 12 add work tracking, publication planning, a portable workflow, and an exercise for detecting stale outputs. Complete website, PDF book, and presentation pipelines, along with interactive dashboards, remain future work. Hosted work-board, export, and Microsoft-environment exercises still need validation in their target environments. The first hosted growth run succeeded for commit `9c91191`; chapter 3 includes its two-revision comparison.

## Explore the Showcase

Chapter 1 follows three [procedure source files](examples/onboarding-showcase/README.md) into an assembled [handbook review copy](assets/onboarding-showcase/handbook.md), a [training excerpt](assets/onboarding-showcase/training-excerpt.md), and a [review-status chart](assets/onboarding-showcase/review-status.png). The [generation script](scripts/build_onboarding_showcase.py) builds these views from the same sources.

These are fixed, fictional teaching examples, not operationally approved instructions or a finished publishing system. The handbook includes draft material, the training excerpt is not a slide deck, and the chart is not an interactive dashboard. Chapter 4 uses a separate draft copy for its editing exercise.

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

1. [Document-as-Code: The Living Tutorial](docs/01-introduction.md)
2. [GitHub as a Workspace for Knowledge and Automation](docs/02-github-workspace.md)
3. [Project Growth: History as Data](docs/03-project-growth.md)
4. [Markdown and Content Structure](docs/04-markdown.md)
5. [Structured Content: Metadata, Rules, and Views](docs/05-structured-content.md)
6. [AI-Native Documentation and Context](docs/06-ai-native.md)
7. [Images, Diagrams, and Visual Sources](docs/07-images.md)
8. [Git, Review, and Collaboration](docs/08-git-review.md)
9. [Dashboards and Work Tracking in GitHub](docs/09-dashboards.md)
10. [Publishing to Websites, Books, and Presentations](docs/10-publishing.md)
11. [Beyond GitHub: OneDrive, Copilot, and Other Applications](docs/11-beyond-github.md)
12. [Automation, Quality, and Further Experiments](docs/12-automation.md)

## Planned Outputs

| Output | Purpose |
| --- | --- |
| Website | Navigable tutorial and interactive dashboard |
| PDF book | Coherent long-form reading |
| Presentations | Introduction, workshop, and technical deep dive |
| GitHub dashboard | Repository status, growth charts, and work tracking |
| Context packages | Selected source material for AI-assisted tasks |

Outputs share source material, but each needs appropriate structure and editorial choices. Presentation slides will not simply reproduce every paragraph of the book.

## Growth Tracking

Chapter 3 introduces an automated report updated on changes to the main branch:

- Chapter count and word count, including per-chapter comparisons.
- Historical values reconstructed from Git revisions.
- Capability milestones from the versioned [feature register](data/features.json).
- Work progress from GitHub issues and Projects (chapter 9 introduces work tracking; integration into this report remains planned).

Word counts measure content volume, not quality. The measurement rules distinguish substantive chapters from outlines and exclude generated files. Committed snapshots identify their source revision; optional working-copy measurements are labelled separately.

## Repository Layout

- `docs/`: tutorial chapters.
- `reference/`: optional technical detail linked from chapters, excluded from chapter metrics.
- `examples/`: exercise sources and fixed showcase datasets, excluded from chapter metrics.
- `data/`: capability metadata and future measurement data.
- `assets/diagrams/`: editable diagram sources referenced by chapter visual metadata.
- `assets/figures/`: historical teaching charts and their measurement data.
- `assets/onboarding-showcase/`: generated handbook, training excerpt, chart, and source data.
- `scripts/`: historical measurement, content assembly, structured-record processing, and chart generation.
- `tests/`: focused growth measurement, structured-record processing, and diagram generation checks.
- `.github/workflows/`: automated growth reporting on pushes to main.
- `ROADMAP.md`: stages and completion criteria.
- `CONTRIBUTING.md`: writing and review conventions.
- `GLOSSARY.md`: shared definitions used across chapters.

Further publishing scripts and output-specific configuration will be added as the corresponding exercises are implemented.

## Next Milestone

Review the complete first draft with readers and verify the remaining environment-dependent exercises. Reconcile the capability register with verification evidence, then choose and validate the initial website publishing tools.

No content license has been selected yet.
