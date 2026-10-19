# v1.3 Editorial Review

19 October 2026. Pre-publication editorial and verification record. The owner subsequently authorized committing and publishing the update; the matching Git revision and Pages workflow provide release evidence. Full revised chapter text remains in review.

## Baseline and Scope

Started from clean main at `6d8ee1d`, the deployed v1.2 release. There were no pre-existing uncommitted changes. Preserve its eleven chapters, stable IDs, metadata/history panels, source-backed explorers, six chapter labs, three scenario checks, eleven end quizzes, four decks, and GitHub Pages base path.

The owner accepted the [three before/after samples](V1-3-EDITORIAL-DECISIONS.md) and authorized this pass. That is approval of the writing approach, not blanket approval of all resulting chapters. Chapters 2 and 3 return to in-review because their revisions extend beyond the samples.

## Reading-Path Review

| Chapter | Reader's question and example | Editorial change | Natural next question |
| --- | --- | --- | --- |
| 1 | Can shared onboarding instructions serve several publications? | Opens with a real maintenance need; keeps the three why-now factors and agreed takeaway; clarifies that later examples change | Where do shared sources and proposed edits live? |
| 2 | How can colleagues prepare and review a new access step? | Applies the accepted opening, ties terminology to the change, and removes repeated workspace framing | What evidence does a revision leave? |
| 3 | Who introduced a step, and which revision reached a guide? | Opens with one hypothetical revision; consolidates activity/quality caveats around the corresponding measures | What does the editable source look like? |
| 4 | How does a source edit change the rendered instructions? | Starts with adding a step; introduces the playground before its controls; keeps syntax and format comparisons | How does software identify an owner or review state? |
| 5 | Which procedure still needs review? | Applies accepted template/schema/validator explanation; moves vocabulary to the glossary; keeps single-file validation scope | Which related items may need review after a change? |
| 6 | What should be inspected when a policy changes? | Leads with impact assessment; clarifies guidance versus prerequisites; replaces generic diagram caveat with its actual meaning | How can those sources produce useful outputs? |
| 7 | How do handbook text and a review queue follow different rules? | Starts with audience needs; distinguishes the fixed showcase from the browser lab; reduces repeated output explanations | What else does an agent need to maintain the project? |
| 8 | Which project knowledge governs an agent's edit? | Preserves the v1.2 knowledge map; replaces recap with a concrete task and connects review to diffs/checks | How can people explore connected information themselves? |
| 9 | Which deliveries deserve review for a proposed amendment? | Leads with the question, preserves guided/free exploration, and moves the nine-record inventory below the explorer | How are views refreshed and published? |
| 10 | What runs after a proposed or accepted source change? | Uses the actual repository; moves YAML trigger detail to the publishing reference; preserves check/artifact/deployment distinctions | How do these parts form one working environment? |
| 11 | How does a record reach a reader's browser? | Follows DEL-101 through build and browser interaction; removes duplicate inventories; retains Microsoft 365 comparison and accepted conclusion | Which small information flow is worth trying? |

## Preserved and Relocated Material

- No chapter IDs, numbers, learning goals, maintained records, schema rules, component code, workflow definitions, presentation sources, or diagram source files change.
- Chapter 5's term table is replaced by a glossary link. Existing entries are reused; missing terms are added to GLOSSARY.md.
- Chapter 9's nine-record table remains in the chapter, after the interactive entry. Markdown readers can still inspect its source links and relationships.
- Chapter 10's deployment-trigger YAML is retained verbatim in the publishing reference, checked against the actual workflow.
- Chapter 11's duplicated inventories are replaced by the existing source map, site/presentation guides, and source-backed Architecture Explorer. Its meaningful output boundaries remain in prose.
- Captions in chapters 6 and 10 explain the relationships and publication boundary without changing their diagrams.
- Existing scenario feedback, quiz questions, button labels, and browser-only persistence rules remain intact. The slides still express the same supported teaching messages.

## Writing Guidance

CONTRIBUTING.md now makes conventional exercises optional and defines the accepted voice and review practice. AGENTS.md links to those rules rather than copying them. The current specification adds narrative contracts; the original v1.2 audit and implementation record remain historical.

## Verification

- `npm run check`: 69 files; zero errors, warnings, or hints.
- `npm run build`: successful. The existing large-JavaScript-chunk warning remains; no new executable component or dependency was added.
- `npm run test:learning`: passed, including scenario configuration/state tests and architecture checks.
- `npm run test:content`: passed; internal links, assets, eleven stable IDs, matching Mermaid sources, and legacy redirects resolve.
- `npm run test:homepage`: passed; all eleven chapters, four decks, 37 slides, and speaker notes remain.
- `npm run test:contracts`, `npm run test:dashboard`, and `node scripts/test-budget.mjs`: passed.
- `.venv/bin/python -m unittest discover -s tests`: 17 passed.
- PDF-focused unit tests: 11 passed using the existing local environment. No new PDF rendering or full-book verification was performed.
- A direct comparison with HEAD confirmed unchanged chapter IDs, numbers, learning goals, visual metadata, interactive markers, and source code examples. The one removed deployment YAML block is retained verbatim in the publishing reference.
- `git diff --check`: clean. No output directories or historical measurement assets are changed.

The in-app browser checked all eleven chapter pages at 1440px and 390px widths. Each had one end quiz, with scenarios present only in chapters 5, 6, and 8; no page-level horizontal overflow was observed. The guided Contract Explorer still selects the amendment's impact view and labels AMD-001 proposed, not effective.

No-JavaScript alternatives and keyboard/state behavior are covered by the unchanged component tests; this pass did not repeat a full screen-reader or JavaScript-disabled browser audit. Technical checks do not approve the prose or establish learning effectiveness. These checks preceded the owner's publication request; hosted verification is a separate release step.

## Local Preview

- [Start reading the revised tutorial](http://127.0.0.1:4325/document-as-code-lab/chapters/01-introduction/).
- [Chapter 5: shorter route to schema validation](http://127.0.0.1:4325/document-as-code-lab/chapters/05-structured-content/).
- [Chapter 9: question before inventory](http://127.0.0.1:4325/document-as-code-lab/chapters/09-images/).
- [Chapter 11: source-to-browser story](http://127.0.0.1:4325/document-as-code-lab/chapters/11-beyond-github/).

At the time of local review, the deployed baseline was v1.2 at `6d8ee1d` and these previews contained the uncommitted editorial revision. The owner subsequently authorized its release.

## Changed Files

`AGENTS.md`

`CONTRIBUTING.md`

`GLOSSARY.md`

`README.md`

`ROADMAP.md`

`docs/01-introduction.md`

`docs/02-github-workspace.md`

`docs/03-project-growth.md`

`docs/04-markdown.md`

`docs/05-structured-content.md`

`docs/06-information-architecture.md`

`docs/07-processing.md`

`docs/08-ai-native.md`

`docs/09-images.md`

`docs/10-publishing.md`

`docs/11-beyond-github.md`

`reference/publishing-workflows.md`

`spec/tutorial/01-REUSABLE-TUTORIAL-SPECIFICATION-TEMPLATE.md`

`spec/tutorial/02-DOCUMENT-AS-CODE-LAB-V1-SPECIFICATION.md`

`spec/tutorial/04-DESIGN-DECISIONS.md`

`spec/tutorial/EDITORIAL-REVIEW.md`

`spec/tutorial/README.md`

`spec/tutorial/V1-3-EDITORIAL-AUDIT.md`

`spec/tutorial/V1-3-EDITORIAL-DECISIONS.md`

## Owner Review

Review the eleven chapter diffs independently, especially the shortened Chapter 5, reordered Chapter 9, and source-to-browser story in Chapter 11. Accept, request revision, or reject the resulting wording. Publication remains a separate authorized step.
