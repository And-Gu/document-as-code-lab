# Presentations-as-Code

The tutorial chapters in `docs/` remain the maintained knowledge. Presentation YAML selects messages and a teaching sequence; it does not contain chapter copies. Review the selected messages against their linked chapters when either changes. Source links provide traceability, not automatic synchronization or approval.

`document-as-code-intro.yaml` uses chapters 1, 2, and 11 (the publishing chapter retains its `10-publishing` source filename). It builds at `/document-as-code-lab/presentations/document-as-code/`. The presentation index is `/document-as-code-lab/presentations/`.

Two complementary ten-slide packs are also defined here:

- `information-model.yaml`: concept and mechanics at `/presentations/information-model/`, opening in scroll view for independent reading. Its metadata slide lets readers select an inclusion rule for the maintained fictional onboarding records.
- `information-value.yaml`: benefits, limitations, and adoption at `/presentations/information-value/`.

These paths use the site's `/document-as-code-lab/` prefix. Every deck has a readable `/notes/` page generated from the same YAML, with chapter references. The homepage links to both packs; the index retains the original introduction. All decks and note pages are included in the GitHub Pages deployment.

## Define a Deck

`lab-architecture.yaml` adds a nine-slide tour of the maintained sources, Astro, browser components, Actions/Pages, and the Microsoft 365 comparison. It builds at `/presentations/lab-architecture/`, with notes at `/presentations/lab-architecture/notes/`. It uses the same slide components, Reveal.js runtime, and Pages deployment as the other decks.

Add a `.yaml` file in this folder. `slug`, `title`, `description`, and `slides` are required. Each slide has a unique `id`, `type`, `title`, and `sources` list of existing `docs/*.md` paths. An optional plain-text `notes` field supplies speaker notes. All four maintained decks include notes for every slide. The optional deck-level `view` is `slide` (default) or `scroll`. The slug defines its route; the slide ID defines its hash link, such as `#/review`.

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
| `content` | `message`, up to four `bullets`, optional `image` with `path`, `alt`, and optional `caption`; optional `demo: source-selection` |
| `comparison` | `left` and `right`, each with a `title` and up to four `items` |
| `diagram` | `message`, two to five `steps` with `label` and `detail`, optional `outputs` and `caption` |

Image paths are repository-relative under `assets/`. Plain text is escaped by React, not interpreted as HTML. The `source-selection` demonstration reads `examples/onboarding-showcase/{access,equipment,contacts}.md` during the build; its buttons affect the browser preview only. Put it on a content slide with no bullets or image to leave enough room for the table. The schema in `site/src/lib/presentations.ts` rejects unknown fields, missing chapters, duplicate deck slugs, duplicate slide IDs, and missing image files during builds. Keep text short and inspect the rendered result: schema validation does not establish that text fits or that a message is correct.

## Render and Verify

Use the existing site commands from `site/`: `npm run dev`, `npm run check`, and `npm run build`. The existing Python setup and full-history requirements still apply. `npm run preview` serves the production build. All decks use the same Astro build and GitHub Pages deployment as the documentation.

Astro reads YAML and server-renders `PresentationDeck.tsx` and `SlideBody.tsx`. The island hydrates with `client:load`; the official [React wrapper](https://revealjs.com/react/) owns initialization, syncing, and cleanup through `Deck` and `Slide`. `SourceSelection.tsx` uses React state and `useReveal()` for its preview. The layout supplies page metadata and styles. The initial HTML remains readable if JavaScript is unavailable. There is no second application or build system.

The verified baseline on 15 November 2026 is reveal.js 6.0.2, `@revealjs/react` 0.2.2, and React 19.3.1. reveal.js 6 added the official wrapper and package exports; the repository already used the v6 CSS paths and bundled types. Version 6.0.2 includes scroll performance, focus, and security fixes. See the [release notes](https://github.com/hakimel/reveal.js/releases/tag/6.0.2) and [upgrade guide](https://revealjs.com/upgrading/). The Astro React integration requires Node 22.23.4+, provided by the local development dependency for npm scripts.

In slide view, Right/PageDown and Left/PageUp navigate. Home and End jump to the first and last slide. O toggles overview, Escape closes overview, and F enters fullscreen; use Escape to leave fullscreen. The toolbar provides overview, fullscreen, and a view switch. Overview is available in slide view. Scroll view uses a visible progress rail and proximity snapping. URL parameters `?view=scroll` and `?view=slide` override the deck default; switching views opens that URL while retaining the slide hash. A fresh page load avoids reveal.js 6.0.2 replacing React-owned elements when leaving scroll view. The demonstration resets to Approved only when changing views. Reduced-motion preferences disable slide transitions. Buttons and source links keep their normal keyboard behavior. Chapter source links leave the deck; browser Back returns to its slide hash.

After `npm run check` and `npm run build`, run `npm run test:homepage`, `node scripts/test-budget.mjs`, and `npm run test:e2e:cross -- presentations.spec.ts`. The presentation tests cover desktop and narrow screens, every slide, source links, the selection rule, scroll overrides, keyboard controls, reload, and the no-JavaScript reading fallback under the configured base path. The source-selection demo has no browser persistence; reload restores Approved only. Check the published pages after deployment as well. Speaker notes are separate static reading pages, not a synchronized presenter window. PDF/PowerPoint export is not configured.
