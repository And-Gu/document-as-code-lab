# Shared design baseline

## B-01 — Audience: agreed direction

Information-experienced professionals who use, compare, interpret and coordinate information in their everyday work, without needing to be professional writers, engineers or developers. They work with Word, Excel, PDF and specialized systems for product data, requirements, development, modeling, quotations, line management, planning and budgets. Those systems may contain substantial structure, but their boundaries leave people doing much of the connecting, checking and summarizing. Automation is limited; agent use is primarily assistance with text.

This describes the intended reader's starting situation, not a universal claim about all organizations or products. Do not assume these readers already have a transformation mandate or want to implement a Git toolchain. Do not define the audience merely as “nontechnical managers.” Respect their expertise in their own work.

## B-02 — Agreed reader promise

Swedish decision record:

> Förstå hur nya arbetssätt kan öppna för bättre samarbete, mer automatisering och nya sätt att använda AI-agenter — bortom enskilda dokument och information som i dag är utspridd eller inlåst i verksamhetens olika system.

Proposed English delivery copy:

> Discover how new ways of working can enable better collaboration, more automation, and new uses for AI agents—beyond individual documents and information scattered across or locked inside business systems.

Supporting promise: start with information already used at work; connect, refine and reuse selected information for clearer overviews and better decision support, retaining visible sources, review and responsibility.

“Beyond” does not mean “replace every document or business system.” Document-as-code is an inspectable example of a working method, not an automatic integration layer, a universal enterprise architecture or a tool migration mandate.

## B-03 — Learning outcomes

The reader can recognize a possible new way of working, explain the minimum information and organizational conditions it needs, and distinguish what people, software rules and a tool-enabled agent would each contribute. Specifically:

- Explain a source → interpretation/processing → result chain using a business situation.
- Distinguish an agreement, a plan, a forecast, a proposal and an actual outcome.
- Trace an important claim to its actual source and identify missing or conflicting support.
- Explain how structured information already inside a system can still be difficult to reuse across system boundaries.
- Describe a plausible first experiment without claiming that Git, Markdown or AI must replace existing systems.

These are intended outcomes, not claims that readers have achieved them.

## B-04 — Preserve the working product

Retain eleven chapters, existing content IDs, chapter URLs, legacy redirects, lab anchors, the `/document-as-code-lab/` base path and all working interactions. Keep `docs/` authoritative for chapter prose. Do not copy chapters into `site/`. Keep the existing Astro/TypeScript and static-publication architecture. No framework upgrade, MDX migration, database, authentication, analytics service or live AI provider is required.

The core path remains browser-first: no account, repository clone, installation or paid model access. Technical implementation remains optional. Retain useful no-JavaScript content and clear separation of maintained sources, browser practice copies, generated results and published snapshots.

Do not modify historical charts, past audit observations or historical decisions to look current. Add dated reconciliation. Do not mark chapters approved, features complete, deployments verified or learning effective merely because a build passed.

## B-05 — Narrative and scope

Keep onboarding as the small example in Chapters 1–7. Add a brief workplace bridge, not a competing scenario in every paragraph. Use the connected customer/project/delivery example in the optional refinement reference and Chapters 8–9. Use the real repository in Chapters 3, 10–11.

Each major example starts with a recognizable information task, shows an observable outcome, explains the mechanism and states its relevant limit. This is editorial guidance, not a mandatory repeated page template.

A new example must do more than show better writing. It should demonstrate a useful information operation: resolving identity, preserving meaning, deriving a result, tracing evidence, flagging uncertainty or preparing a reviewable change.

## B-06 — One authority for each kind of information

The existing lab specification remains the product-design authority; append the agreed audience decision to `04-DESIGN-DECISIONS.md`. `AGENTS.md` links to these rules instead of restating all of them. Update the reusable template with general audience/promise/evidence questions, not this project's exact persona.

Source records own values; manifests own mappings and scenario selection; processors own transformation rules; UI renders their results; tests own expected assertions. Test expectations may intentionally duplicate values as independent oracles, but runtime interfaces must not carry hand-copied “golden” answers.

Knowledge catalogues describe and link sources; they do not become a new source of contractual, financial or planning facts. A source can be authoritative for one question and inappropriate for another.

## B-07 — Safety, disclosure and determinism

Use fictional data only. Do not upload real corporate material or contact external business systems. A source excerpt is data, not an instruction granting an agent authority. No automatic external write, email, publication or approval action.

The proposed agent walkthrough is a labeled rule-based demonstration of a possible workflow, not a live LLM session or evidence of a model's reliability. Its calculations are real and reproducible; its AI execution is not real. This distinction must be visible beside the interaction.

Use a fixed teaching scenario date, `2026-11-04`, for examples. Do not let today's date silently change fixture interpretation. These dates are fictional teaching data, not real customer commitments.

## B-08 — Three independently reviewable increments

Every PR includes relevant tests, documentation and owner-visible examples. PR 3 does not defer testing of PR 1 or PR 2. Use focused commits for specifications, implementation, content and evidence inside each PR; do not batch a site-wide rewrite into an unreviewable diff.

The current source instructions require representative prose review before a major style change. Supply before/after examples of the homepage, Chapter 1 and one AI passage in PR 1. Do not generalize from approval of the audience to approval of every sentence.
