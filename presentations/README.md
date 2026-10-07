# Presentations-as-Code

The tutorial chapters in `docs/` remain the maintained knowledge. Presentation YAML selects messages and a teaching sequence; it does not contain chapter copies. Review the selected messages against their linked chapters when either changes. Source links provide traceability, not automatic synchronization or approval.

`document-as-code-intro.yaml` uses chapters 1, 2, 9, and 11. It builds at `/document-as-code-lab/presentations/document-as-code/`. The presentation index is `/document-as-code-lab/presentations/`.

## Define a Deck

Add a `.yaml` file in this folder. `slug`, `title`, `description`, and `slides` are required. Each slide has a unique `id`, `type`, `title`, and `sources` list of existing `docs/*.md` paths. The slug defines its route; the slide ID defines its hash link, such as `#/review`.

```yaml
slug: my-introduction
title: My introduction
description: A short session based on the tutorial.
slides:
  - id: opening
    type: title
    title: My introduction
    subtitle: A useful starting point
    sources: [docs/01-introduction.md]
```

Four slide types are available:

| Type | Fields beyond the shared fields |
| --- | --- |
| `title` | `subtitle`, optional `context` |
| `content` | `message`, up to four `bullets`, optional `image` with `path`, `alt`, and optional `caption` |
| `comparison` | `left` and `right`, each with a `title` and up to four `items` |
| `diagram` | `message`, two to five `steps` with `label` and `detail`, optional `outputs` and `caption` |

Image paths are repository-relative under `assets/`. Plain text is escaped by Astro, not interpreted as HTML. The schema in `site/src/lib/presentations.ts` rejects unknown fields, missing chapters, duplicate deck slugs, duplicate slide IDs, and missing image files during builds. Keep text short and inspect the rendered result: schema validation does not establish that text fits or that a message is correct.

## Render and Verify

Use the existing site commands from `site/`: `npm run dev`, `npm run check`, and `npm run build`. The existing Python setup and full-history requirements still apply. `npm run preview` serves the production build. All decks use the same Astro build and GitHub Pages deployment as the documentation.

Astro reads YAML and renders `src/components/slides/`. `PresentationLayout.astro` initializes [Reveal.js](https://revealjs.com/), which owns navigation, overview, progress, transitions, fullscreen, and slide hashes. Styling is in `src/styles/presentations.css`; there is no second application or build system.

Right/PageDown and Left/PageUp navigate. Home and End jump to the first and last slide. O toggles overview, Escape closes overview, and F enters fullscreen; use Escape to leave fullscreen. The toolbar provides overview and fullscreen buttons. Chapter source links leave the deck; browser Back returns to its slide hash.

Check desktop and narrow screens, every slide, source links, images, and keyboard controls under the configured base path. Check the published pages after deployment as well. Notes/presenter mode and PDF/PowerPoint export are not configured in this first version.
