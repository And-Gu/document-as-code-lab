# Roadmap

Reconciled on 25 October 2026. Published baseline evidence and proposed work are separate; a completed build does not approve chapter text or demonstrate learning.

## Established baseline

Published baseline: Astro publishes the tutorial to GitHub Pages, with metadata and Git-history panels. Production deployment, navigation, images, and Mermaid rendering have been verified. Chapter 3 introduces the standalone Project Control Center, whose growth widget uses committed history at build time. Saved charts under `assets/figures/` remain historical snapshots. The CSSV budget table with sorting and filtering is retained in the dashboard reference guide. The Project Control Center is published at `/dashboard/` with authenticated, build-generated operational snapshots on main deployment and an hourly schedule; optional live retrieval remains available. Pages deployment 38152410515 verified all four operational sources, workflow states, source revision, and generation timestamps. Workflow states describe collection time, and scheduled runs may be delayed. The v1.3 editorial update preserves the v1.2 functionality; all eleven revised chapters remain in review. Full-book generation and several interactive exercises remain future work.

The first HTML introduction deck uses YAML, reusable Astro components, and Reveal.js in the existing site build. Local production checks cover its eight slides, source links, navigation, overview, fullscreen, and desktop/phone layouts. Two additional ten-slide packs cover the information model and its value, with chapter references and separate speaker-note pages. The nine-slide architecture deck explains the lab's implementation. The homepage groups all 11 chapters into four learning paths. All four decks are included in the site build and Pages deployment. The hands-on workshop deck and book remain to be developed; these decks do not meet the presentation capability's introduction-and-workshop completion criterion.


The tutorial has eleven chapters, browser-only labs and quizzes, the nine-record Contract Explorer, the Architecture Explorer, four HTML slide decks and a published dashboard. Historical measurements identify their source revisions. The PDF workflow verifies a limited three-page design proof; it is not a full book. See the existing [editorial review](spec/tutorial/EDITORIAL-REVIEW.md) and [PDF trial evidence](publishing/pdf/README.md) for their original scope and limitations.

## Next work

1. Collect real reader observations using the completed study kit when suitable participants are available. Learning evidence remains **not run**; the kit and engineering checks do not prove effectiveness.
2. Perform physical-device and manual assistive-technology checks; local browser emulation and automated checks remain separately identified.
3. Review individual chapter revisions and address actual reader findings. Merge/publication authorization does not blanket-approve all pre-existing chapter drafts.

Packages 1–3 and their specifications were merged on 25 October 2026. The reader journey, refinement lab, source catalogue, deterministic replay and verification harness are published. [Deployment 40238084101](https://github.com/And-Gu/document-as-code-lab/actions/runs/40238084101) and a separate public smoke check verified source revision `9ac44630269e220a8ea6f6607f7d81b971901bcd`. Historical measurements and the earlier publication evidence above retain their original scope.

See the [package register](spec/tutorial/working-methods-upgrade/README.md). Merging a specification is not completing its implementation.

## Later possibilities and decisions

- Expand the Pandoc/Typst proof into a PDF book with navigation, pagination, cross-references and accessibility verification; inspect every output page.
- Create the remaining hands-on workshop deck. Existing HTML decks do not satisfy the introduction-and-workshop capability criterion.
- Document how output-specific Word/PowerPoint edits return to maintained sources.
- Verify a bounded workflow in the selected Microsoft environment, including organizational permissions and licensing. The current comparison is illustrative.
- Consider dependency-aware updates and additional work-tracking views when a concrete reader need warrants them.

Astro/Reveal.js are already selected for the website and HTML decks, and Matplotlib for historical charts. Full-book suitability and the Microsoft test environment remain decisions to resolve. Record capability completion in `data/features.json` only against verified criteria. Owner approval, deployment, physical-device/accessibility checks and learning evidence remain distinct.
