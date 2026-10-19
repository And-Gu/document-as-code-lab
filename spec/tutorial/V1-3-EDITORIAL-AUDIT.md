# Document-as-Code Lab — v1.3 Editorial Audit and Next Improvement Backlog

> **19 October 2026 · Proposal for owner approval.** This is an evidence-informed editorial plan, not a claim that v1.3 or all of v1.2 has been published or tested.

## 1. Source baseline and confidence

- GitHub repository source currently contains 11 Markdown chapters, with Chapter 12 absent.
- Chapter 8 in the checked remote still used the earlier "AI Needs Context, Not Just Prompts" framing. The approved v1.2 agent-ready knowledge direction had not yet appeared in that source.
- The project has Astro chapter pages, quizzes, browser labs, a Contract Explorer and Architecture Explorer, and linked references. v1.2 changes must be inspected on the actual branch before rewriting their text.
- The site's cached public search snapshot did not match the latest repository chapter list. **Do not infer current deployed site behavior or visual quality from that snapshot.**
- This review covers reader-facing source language and source architecture. No browser-based accessibility, performance or end-to-end interaction acceptance is claimed.

## 2. Editorial quality findings

**Strengths to preserve:** Real explanations, a coherent arc from onboarding to the functioning lab, precise boundaries between approval and validation, browser-first examples, and concise direct vocabulary.

**Opportunities for smoother reading:**
1. Some chapters define concepts before explaining what problem they solve (notably Chapters 2, 5, 6 and 10).
2. Repeated phrasing about "maintained information", source/output distinction and review limits can feel more like a specification than a guided article. Keep all material qualifications, but show them at the relevant result rather than multiple generic warnings.
3. Chapter 5's thirteen-entry "Concepts so far" table interrupts the progression into the metadata lab.
4. Chapter 9 leads with an inventory of example IDs before the reader encounters an interesting contract question.
5. Chapters 10–11 contain substantial lists of implementation details, which are valuable as references but can interrupt their architecture story.
6. Openings, takeaways and "Next" handoffs vary from natural transitions to mechanical teaching instructions.
7. Repo `CONTRIBUTING.md` still says each chapter should have "an exercise with an observable result". That conflicts with the agreed optional-exercise policy and must be reconciled before an agent performs editorial work.

## 3. Recommended v1.3 improvement package

| Order | ID | Change | Expected reader benefit | Acceptance evidence |
| --- | --- | --- | --- | --- |
| 1 | E-01 | Establish editorial voice and narration contract in template, lab spec, `CONTRIBUTING.md` and agent entry point | Consistent language without flattening author voice | Owner approves 3–4 before/after excerpts; no mandatory-exercise rule |
| 2 | E-02 | Tighten chapter opening, paragraph rhythm, and progression for Chapters 1–11 | Reader sees why each chapter matters early | Concrete opening within ~100 words; one new insight per chapter |
| 3 | E-03 | Consolidate repeated definitions, large term tables and recurring caveats | Less effort and interruption while reading | One primary definition per term; important limitations still adjacent to claims |
| 4 | E-04 | Refine transition paragraphs between scenarios and chapter groups | One continuous course, despite different examples | Onboarding → agents → contracts → actual site changes are explained naturally |
| 5 | E-05 | Integrate questions, labs, diagrams, and results in the prose | Interaction feels part of the teaching, not an inserted widget | Each primary activity has context and a 1–2 sentence interpretation |
| 6 | E-06 | Rewrite contextual links, captions, headings and key conclusions | Skim and reference routes feel useful and inviting | Benefit-led link text; concise headings; no redundant takeaway copy |
| 7 | E-07 | Owner editorial approval and functional regression check | Authorial consistency while preserving technical trust | Approved before/after set; correct statuses/sources; build, links, quiz/deck integration tested |

**Delivery:** One coordinated, chapter-by-chapter editorial update *after* current v1.2 changes are present in the branch being edited. Keep chapter diffs independent for inspection; do not ask an agent to replace all chapter files blindly. Owner sign-off is the only educational design gate at this stage; functional/accessibility verification remains required.

## 4. Per-chapter review map

| Chapter | Narrative focus | Priority |
| --- | --- | --- |
| 1 — Introduction | Get from why now to real onboarding example faster; retain agreed concluding insight | High |
| 2 — Workspace | Start with proposed change, then define repository, Git and GitHub as needed | High |
| 3 — History | Show what one revision reveals, then group caution statements beside relevant evidence | Medium |
| 4 — Markdown | Let edit-and-preview example drive the explanation | Medium |
| 5 — Structure | Replace lengthy conceptual inventory with short relevant contrasts and glossary link | High |
| 6 — Traceability | Lead with a change-impact situation, then explain identities and links | High |
| 7 — Processing | Lead with a requested output, then trace its input/rules | Medium |
| 8 — AI agents | Review newly approved AGENTS.md / architecture / decision-log framing after v1.2 merge | High (dependency) |
| 9 — Explorer | Lead with one contract decision rather than nine record IDs | High |
| 10 — Actions | Lead with what happens after source revision, link detailed workflow mechanics | Medium |
| 11 — Behind the Lab | Make a source-to-result journey the main story, minimize redundant technical inventories | High |

## 5. Quality acceptance rubric

For every changed chapter, have an editor review **seven questions**, not only word count:

1. **Reason to care:** Does the opening provide a concrete reader question or situation?
2. **Progression:** Does each section make one new step toward answering it?
3. **Plain accuracy:** Does the text explain technical meaning clearly without equating distinct concepts?
4. **No unnecessary repeat:** Is each major idea defined once and revisited only for a new purpose?
5. **Engagement:** Is any interactive element preceded by a clear reason and followed by a useful conclusion?
6. **Continuity:** Is a new example introduced with its purpose, and does the ending support the next step?
7. **Reference value:** Can a reader tell what each deeper link offers, without being pushed into mandatory homework?

The owner decides **Accept / Revise / Reject**. Automated tests check links, content structures, build and component behavior but cannot certify that prose flows well. Do not optimize to a rigid sentence length, sentence count or readability score. Strong precise sentences are preferable to shorter but misleading ones.

## 6. Guardrails

- Preserve stable chapter IDs, front matter, maintained sources, diagrams, meaning and links unless a specific editorial change calls for updating them together.
- No accidental expansion into a Git tutorial, required coding exercises, external AI service, new front-end framework or new curriculum chapter.
- Preserve authority and lifecycle distinctions close to their relevant claims: validated ≠ approved; proposed ≠ effective; inferred candidate ≠ recorded fact; build ≠ deployment; accessible ≠ authorized.
- Do not add a quiz, image or subsection just to meet a count; the current scenarios/labs should be used more effectively.
- Do not remove an accurate nuanced point because it is harder to phrase. Move it to a supporting guide when it is optional depth.

## 7. Editorial delivery protocol

1. Agent inspects the latest branch and `AGENTS.md`, `CONTRIBUTING.md`, glossary, design decisions, and specification.
2. Agent prepares three sample edits (one opening, one deep explanation, one concluding chapter) with original and proposed copy, editorial rationale, and owner review status.
3. Following owner approval, apply the agreed voice and flow across all 11 chapters, preserving each one's learning contract.
4. Update glossary, references, interactive microcopy and presentation excerpts only when their actual dependencies change.
5. Run source, link, presentation, quiz, accessibility-focused component and Astro build checks.
6. Produce a small reading-path review summary, list of changed files, unresolved questions, and evidence for checks actually run.

**Not included:** A user-testing study, a new information architecture application, additional dashboards, or automatic full-site rebranding.

## Implementation Baseline Reconciliation

The original observations above predate the published v1.2 update. The editorial implementation starts from clean main at `6d8ee1d`, with the agent-knowledge chapter, three scenario checks, guided Contract Explorer, and eleven-chapter site already deployed. The owner accepted three representative samples and authorized the editorial pass. See the [accepted samples](V1-3-EDITORIAL-DECISIONS.md) and [editorial review](EDITORIAL-REVIEW.md); the original audit is retained as provenance, not a live status report.
