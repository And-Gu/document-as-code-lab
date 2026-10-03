# Document-as-Code Lab

A living tutorial and visualization lab: write in Markdown, track changes, and turn shared source material into a website, a PDF book, and presentations.

The project teaches document-as-code by applying it to itself. Its content, publishing capabilities, and work history become material for practical visualization exercises.

## Status

Planning and chapter outlines. Publishing pipelines and dashboards are not implemented yet.

## Learning Goals

- Structure and maintain reusable documentation.
- Give language models relevant, traceable context.
- Measure project growth using Git history and GitHub data.
- Create diagrams, images, and dashboards.
- Adapt shared material to web, book, and presentation formats.
- Transfer these practices to lighter workflows using OneDrive, Word, and Copilot.

## Tutorial

1. [Document-as-Code: The Living Tutorial](docs/01-introduction.md)
2. [Project Growth: History as Data](docs/02-project-growth.md)
3. [Markdown and Content Structure](docs/03-markdown.md)
4. [AI-Native Documentation and Context](docs/04-ai-native.md)
5. [Images, Diagrams, and Visual Sources](docs/05-images.md)
6. [Git, Review, and Collaboration](docs/06-git-review.md)
7. [Dashboards and Work Tracking in GitHub](docs/07-dashboards.md)
8. [Publishing to Websites, Books, and Presentations](docs/08-publishing.md)
9. [Beyond GitHub: OneDrive, Copilot, and Other Applications](docs/09-beyond-github.md)
10. [Automation, Quality, and Further Experiments](docs/10-automation.md)

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

Chapter 2 will introduce an automated report updated on changes to the main branch:

- Chapter count and word count, including per-chapter comparisons.
- Historical values reconstructed from Git revisions.
- Capability milestones from the versioned [feature register](data/features.json).
- Work progress from GitHub issues and Projects.

Word counts measure content volume, not quality. The measurement rules will distinguish substantive chapters from outlines and exclude generated files. Every snapshot will identify its source commit.

## Repository Layout

- `docs/`: tutorial chapters.
- `data/`: capability metadata and future measurement data.
- `ROADMAP.md`: stages and completion criteria.
- `CONTRIBUTING.md`: writing and review conventions.

Build scripts, visual assets, and output-specific configuration will be added as the corresponding exercises are implemented.

## Next Milestone

Write chapter 1 and a runnable first exercise for chapter 2. Use that exercise to choose and validate the initial publishing tools.

No content license has been selected yet.
