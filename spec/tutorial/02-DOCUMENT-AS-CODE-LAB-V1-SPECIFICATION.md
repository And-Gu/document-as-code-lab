# Document-as-Code Lab — Learning Product Specification v1.4

> **Intended baseline v1.4 · 25 October 2026 · audience direction agreed; package 1 implementation and final wording/design in review**\
> Derived from `01-REUSABLE-TUTORIAL-SPECIFICATION-TEMPLATE.md`. **Target:** 11 chapters (remote repository source now confirms Chapter 12 absent); keep rewritten Chapter 10; Chapter 11's current “Behind the Lab” treatment may be retained, selectively edited, or simplified. This is the **intended specification**, not a claim that everything is implemented or user-tested.

## 1. Product promise

**Reader promise:** Discover how new ways of working can enable better collaboration, more automation, and new uses for AI agents—beyond individual documents and information scattered across or locked inside business systems.

**Primary outcomes:** Recognize a possible working-method experiment; explain its source → processing → result chain and the information, responsibility and access it needs; trace a claim to evidence; distinguish a plan, commitment, forecast, proposal and outcome; explain what people, configured rules and a tool-enabled agent each contribute. These are intended reader outcomes, not measured learning results.

**Secondary outcome:** A practitioner can inspect the tutorial's own GitHub/Astro implementation and adapt its patterns, or recognize analogous approaches using existing document environments such as Microsoft 365.

**What it is not:** A Git training course; a Markdown syntax encyclopedia; a software installation tutorial; a complete CI/CD manual; a mandate to migrate every Word document into Git; or a mandatory hands-on lab course.

**Positioning:** A compact, approachable learning website with purposeful visuals, self-contained browser interactions, source-linked examples, optional deeper references, and actual project evidence. The site illustrates its own subject.

## 2. Audiences and paths

| Reader | Starting position | Core path | Optional next step |
| --- | --- | --- | --- |
| Information-experienced professional (primary) | Uses Word, Excel, PDF and specialized business systems; understands their domain but need not be a writer, engineer or developer | Explore the examples and eleven-chapter journey | Identify a bounded experiment in their own work |
| Reader seeking implementation depth (optional) | Wants to inspect or adapt the mechanisms | Follow the same conceptual journey | Inspect sources, scripts, workflows and implementation references |

Information can be richly structured inside product, requirements, modeling, quotation, planning or budget systems while remaining difficult to combine across their boundaries. The intended reader often connects, interprets and summarizes it manually, with AI mainly helping develop text. This is a starting situation, not a claim about every organization. Document-as-code is our inspectable demonstration; it neither integrates business systems automatically nor requires replacing familiar tools.

**Browser-first requirement:** All chapter learning outcomes must be achievable without cloning a repository, using an AI account, or installing Node/Python. Optional implementation tasks may require tools but are outside the core path. State whether a UI example is browser-only, build-time, or actually live.

## 3. Curriculum structure — intended 11 chapters

Groups are coherent reader journeys. The homepage should use these *semantic group definitions* rather than outdated hard-coded ranges.

| Group | Chapters | Learning shift |
| --- | --- | --- |
| **G1 — Work with maintained sources** | 1–4 | From document thinking to shared, versioned, readable sources |
| **G2 — Make information processable** | 5–7 | From readable text to metadata, relationships, rules, and generated results |
| **G3 — Use information in new ways** | 8–9 | From information sources to AI context and interactive exploration |
| **G4 — Make it a working environment** | 10–11 | From local processing to automation, publication, system architecture, and transferability |

### Chapter-by-chapter specification

| # | Intent: what is new? | Reader should be able to… | Preferred experience | Optional deeper destination |
| --- | --- | --- | --- | --- |
| **1. Document-as-Code: Information We Can Work With** | Establish why the separation of maintained sources and outputs matters | Distinguish a maintained item, a generated view, and an approval state | Onboarding selection lab + before/after visual | Sources, glossary, introduction presentation |
| **2. A Shared Workspace for Information** | Explain repository vs Git vs GitHub and proposed changes without becoming Git training | Identify where content lives and how changes reach shared sources | An annotated repository/PR journey; optional code-free example | Collaboration reference |
| **3. History Is Useful Information** | Show that revisions and evidence create traceability; activity ≠ quality | Identify what history proves and does not prove | Annotated real-history snapshot or a simple comparison | Project Control Center; growth measurement guide |
| **4. Markdown: Readable Sources** | Show why readable text is easy for people and tools to maintain | Change Markdown and recognize source versus rendering | Live Markdown Playground; immediate feedback | Syntax references for people who want more |
| **5. Structure Makes Information Actionable** | Add metadata with defined meaning and validation | Identify useful fields and distinguish valid structure from accurate content | Metadata validation lab + visible source/metadata/result trio | Record-processing reference |
| **6. Information Architecture and Traceability** | Show object boundaries, identities, and meaningful relationships | Trace candidate impacts without assuming every linked item must change | Select/highlight relationships or a clearly annotated case | Record-processing and visual-source references |
| **7. From Sources to Results** | Demonstrate transformations and distinct outputs from common sources | Predict what changes in a handbook or review queue after a source edit | Processing Lab; side-by-side sources and outputs | Record-processing, automation details |
| **8. Making Information Usable by AI Agents** | Show how maintainable project knowledge supports agent work | Distinguish `AGENTS.md` instructions, information architecture, terminology, decisions, authoritative sources and checks | Real `AGENTS.md` excerpt + one contextual scenario check about where rules/rationale belong; no contrived AI quality comparison | Reworked AI Context and Agents reference |
| **9. Information You Can Explore** | Move from predetermined reports to questions over interconnected maintained data | Navigate agreement, project, and delivery relations and distinguish recorded from inferred impacts | Contract Explorer with three views | Visual-source guide and dashboard examples |
| **10. Automating Information with GitHub Actions** | Show that source changes can trigger repeatable checks, builds, and publishing | Trace PR → check versus main/schedule → build → Pages; inspect a run | Real workflow map with annotated steps; optional live Actions page | Automation and publishing guides |
| **11. Behind the Lab: How We Built This Tutorial** | Reveal the system the reader just used and transfer the principles to other tools | Trace Markdown → Astro → JS/Reveal.js → GitHub Actions → Pages; compare with M365 | Architecture Explorer and one clear architecture diagram | Presentations authoring, workflows-across-tools, implementation references |

**Editorial decision on Chapter 11:** Its current long form is not automatically rejected. Retain its valuable architectural overview; selectively tighten repeated inventories and transitions after owner review. Chapter 12's *start with one small information flow* message may become a very short optional closing or a supporting reference—not another mandatory chapter.

## 4. Narrative examples and data boundaries

| Example | Role and chapters | Maintained data | Explicit learning boundary |
| --- | --- | --- | --- |
| **Onboarding procedures** | Opening, metadata, processing (1, 4–7) | `examples/onboarding-showcase/` and related examples | Draft/approved procedure state is not execution or publication |
| **Requirement records** | Deeper reference and AI context (5, 7–8 reference) | `examples/structured-content/records/` | Approved requirement ≠ implemented and tested capability |
| **Contract Explorer** | Broader business scenario (9) | `examples/contract-explorer/records/` | Proposed amendment ≠ effective contract; graph traversal ≠ verified impact |
| **This GitHub/Astro repository** | Real-world meta-example (3, 10–11) | Git history, workflows, site code, YAML decks | Published/build-time snapshot ≠ true live feed; successful build ≠ content approval |

**v1.4 scenario boundary:** Keep onboarding as the small example in Chapters 1–7. Use brief workplace bridges to show why the method matters beyond this example. Package 1 improves existing experiences only; the cross-source refinement lab and agent walkthrough belong to package 2. They are not present merely because their specifications exist.

**Scenario transitions:** At the start of Chapter 9 say why we leave onboarding for a customer/project/contract example. At Chapter 10 say why we now examine the *actual tutorial repository*. Explicitly label fictional teaching datasets versus real repository status. Do not require readers to remember every example ID from earlier chapters.

## 5. Engagement policy

**Default chapter experience:** concise narrative + one concrete example + one meaningful visual or comparison + optional short quiz. **Labs are selected for pedagogical value, not imposed on every chapter.**

**Existing core labs to preserve:** Chapter 1 selection, Chapter 4 Markdown editor, Chapter 5 metadata validation, Chapter 7 processing, Chapter 9 Contract Explorer, Chapter 11 Architecture Explorer. The website already has quizzes in every chapter. Retain these unless an explicit owner decision or verified defect justifies changing them. There is no requirement to add more labs to reach an arbitrary count.

**Quiz requirements:** Usually 1–3 questions, each probing a common misconception or decision. Provide feedback explaining *why*. Avoid trivia and automatic uniform quizzes where an in-context check would work better.

**Exercise requirements:** No required offline exercises in core chapters. Convert procedural assignments like “clone, edit, run” into (a) optional reference activities or (b) on-page experiences when the concept benefits. Existing `Try it` text can be reframed as `Explore` if no actual local action is needed. An offsite Actions run or GitHub file is a useful *inspectable example*, not compulsory homework.

**Components must disclose:** test/fake versus real data, browser-only edits, refresh behavior, underlying maintained source, results of failed validation, and whether edits persist.

### Preferred on-page learning loop

**Invite → (optional predict/hint) → act → observe → explain → try another variation.** Use this where learners can observe a causal change. Do **not** force 'attempt first' where a novice lacks prerequisites. Show hints and worked examples as choices, not a punishment for wrong answers. A lesson-completion statement should explain the conceptual result without pretending the source was approved or published.

**Initial in-context enhancement: Chapter 5 — Validate procedure metadata.** The existing editor and validator should remain the working engine. Add a small scenario question *around* it rather than building a second lab:

1. **Invite:** “What happens if a procedure has no owner?” Show `owner: people-team` in context and a short prediction option (or “Show me first”).
2. **Act:** Remove `owner` in the existing editor; press **Validate metadata**. Preserve the explicit validation action so 'modified' is not mistaken for 'checked'.
3. **Observe:** Show a localized diagnostic (`owner is required`) and distinguish *edited source* from *last validation result*. Keep the editor and result simultaneously visible on desktop; use accessible order on mobile.
4. **Explain:** “The schema detects a missing field. It does not establish that the named owner is correct or that the procedure is approved.”
5. **Recover:** Restore `owner`, revalidate, and show a quiet “What you demonstrated” message; offer **Why does this matter?** to the record-processing reference.

The current lab already has an editor and explicit validation. The owner will review an integrated in-context scenario check and its explanatory feedback; technical verification covers behavior, not generalized learning claims. Avoid re-implementing the parser or changing schema rules just to fit a visual pattern.

**Second guided-design target:** Chapter 9 Contract Explorer. Borrow an *orient → select → trace → interpret → inspect source* flow from Observable and visual-storytelling sites. Make the first business question obvious (“Which delivery might be affected?”), but preserve advanced views. A graph or zoom interaction must have a readable list/table alternative.

**Scenario checks:** Reuse a small in-content component where a substantive judgment or misconception exists (initial targets Chapters 5, 6 and 8; additional uses only when justified). Answer feedback explains *why*. No scores, streaks, persistence, or obligatory completion. Retain end-of-chapter quizzes if nonduplicative, but do not force quiz counts. Optional hint/retry is encouraged.


## 6. References, visuals, and reader invitations

### Reference discovery map

| Reader reaches this question in… | Offer this deeper resource | Better link invitation (example) |
| --- | --- | --- |
| Ch 2: “How do teams review an update?” | `reference/review-and-collaboration.md` | **Want to inspect a real change?** The collaboration guide walks through diffs and review decisions. |
| Ch 3: “Where did the growth figures come from?” | `reference/growth-measurement.md` | **Trace a chart to its data:** see the measurement rules and reproducible calculation. |
| Ch 5/7: “Can I run these rules?” | `reference/record-processing.md` | **Want the executable example?** Run the record processor and compare its outputs. *(Optional local setup.)* |
| Ch 8: “How can an agent find the right project rules and decisions?” | `reference/ai-context-and-agents.md` | **Make your project agent-ready:** connect AGENTS.md, architecture, vocabulary, decisions and checks. |
| Ch 9: “How are these visuals created?” | `reference/visual-sources.md` | **Go behind the diagram:** learn which source formats preserve relationships and how they are rendered. |
| Ch 10: “What exactly runs on Actions?” | `reference/automation-quality.md`, `reference/publishing-workflows.md` | **Inspect the real workflow definitions:** see triggers, outputs, and failure handling. |
| Ch 11: “How can I build a site or slides like this?” | `site/README.md`, `presentations/README.md` | **Reuse the site and slide pattern:** inspect Astro components and the YAML deck format. |
| Ch 11: “Could we use Microsoft instead?” | `reference/workflows-across-tools.md` | **Use your existing Microsoft environment:** compare OneDrive/SharePoint, Copilot, review, and automation. |

Supporting reference pages remain outside chapter numbering. Each chapter link should promise an answer/benefit and flag tools required. Provide a clear return path from supporting material.

### Proposed visual system

**Aesthetic:** calm and modern, warm paper-like neutrals, restrained sage/olive with a small contrasting accent, human-centered lightly sketched/pencil artwork where useful, crisp technical diagrams and genuinely interactive views. This is a proposal to review, **not** a requirement to replace the existing visual identity.

**Visual patterns to standardize:** (1) annotated before/after, (2) object-relationship diagram with legend, (3) source → processing → output strip, (4) evidence/source card with status and revision, (5) quiet reference teaser, (6) lab entry/feedback block. Avoid repeating a generic four-box flowchart in every chapter.

**Pacing:** Keep explanatory prose next to the visual result it interprets. Use a compact top-of-section question, a focused control, and a short conclusion. Move implementation-level options to expandable details. Prefer calm persistent feedback to pop-up error interruptions. Make the graph useful without animated zoom.

**Reusable graphical primitives to prototype (not all mandatory):** learning-question strip; side-by-side input/result; inline hint disclosure; outcome/diagnostic bar; one-line learning reflection; source/provenance chip; and contextual next-step link. Use them only where they replace confusion or excess prose. Cards and colored labels must carry meaning, not mere visual variety.

**UX behavior:** Consistent headings and section spacing; table/code overflow on mobile; obvious active chapter and next/previous link; discoverable labs; concise feedback and reset; clear difference between reference links and actions; readable diagrams on narrow screens; accessible focus states and alt text. Review against WCAG 2.2 AA. Chapter text should remain useful when JavaScript is disabled.

**Visual density guidance:** Each chapter should have one purposeful visual explanation or interaction near the key learning moment, plus extra graphics only when they materially simplify a question. Do not mandate a decorative image on every page.

## 6A. v1.3 Editorial and Reading-Flow Requirements

**Primary intent:** Improve the reading experience without changing the learning objectives, technical meaning or approved interaction design. This is an editorial pass, not a request to expand scope or invent new content.

**Voice:** clear, conversational, precise and respectful. The reader is an intelligent non-specialist; practitioners may skim but should not feel talked down to. Favor people, situations and consequences over abstractions. Use exact technical words where they carry meaning, and define them at point of need.

**Chapter narrative:** Open with one concrete reader problem, then explain the necessary mechanism and use the existing examples/labs to demonstrate it. Don't open each section by summarizing the previous chapter. In a natural ending, state the insight and leave a relevant next question. Avoid repeating the same benefit in the opening, last paragraph and boxed takeaway.

**Specific continuity requirements:** Use the Onboarding Lab consistently in Chapters 1–7; move from that example to the actual repository and agent-ready knowledge in Chapter 8; explicitly introduce the fictional contracts scenario in Chapter 9; close by revealing the real build/publishing architecture in Chapters 10–11. Transitions should explain why the reader is seeing a different example.

**Caveats:** Keep important distinctions—metadata validity versus accuracy/approval; requirement approval versus implementation; review candidate versus confirmed impact; source versus generated view; build-time versus live; agent file access versus authority. Place each qualification next to the particular example or result where confusion could arise, and eliminate repetitive generic warnings elsewhere.

**Lists, tables, callouts:** Keep only those that improve scanning or comparison. Replace long definitions tables inside core chapters with a small relevant comparison and a glossary invitation. A scenario question should flow naturally from surrounding text, not feel like an isolated exam. A reference card should offer useful depth without interrupting the main story.

**Editor quality gates:**
- Chapter starts with a specific question/situation within the opening ~100 words.
- Every section advances the single intended chapter insight; repeated definitions are consolidated or linked.
- New technical terms are explained at first useful appearance, not preloaded in bulk.
- Headings and transitions create a readable progression; avoid formulaic "This chapter..." and "Next..." boilerplate when prose works better.
- Questions, diagrams and labs are introduced and followed by a sentence explaining the consequence.
- Source links and optional references promise a concrete benefit, and any prerequisites are explicit.
- Meaning of the original claims is preserved; no changed technical assertions without source verification.
- The owner reviews representative before/after passages before approving a site-wide editorial pattern.

**No mandatory word quota and no mandatory exercise per chapter.** Retain concise writing but do not amputate the example, rationale or necessary qualification to reach a number.

### Chapter-by-chapter editorial opportunities

| Chapter | Why the flow may improve | Proposed editorial treatment |
| --- | --- | --- |
| 1 Introduction | Three separate trend explanations and repeated value propositions precede the first lab | Tighten the route to the onboarding story; preserve the important "why now" factors and the agreed takeaway |
| 2 Workspace | Definitions and procedural list can feel like a Git mini-manual | Lead with a change to a procedure; explain repository / Git / GitHub in that context; retain precise distinctions |
| 3 History | Multiple cautions about what history cannot establish interrupt progression | Cluster cautions beside the corresponding history/dashboard claim; highlight one useful reader decision |
| 4 Markdown | Instructional tone can be more connected to visible outcomes | Let the playground demonstrate one small edit and its resulting rendered view |
| 5 Structured content | Large "Concepts so far" table delays validation experience | Move most glossary material to `GLOSSARY.md`; keep only terms needed for the scenario question and lab |
| 6 Traceability | Mostly abstract definitions and relationships | Make the procedure/policy change scenario carry the explanation and adjacent knowledge check |
| 7 Processing | Pipeline details sometimes replace the reader's question | Lead with the result readers want, then show how the processor gets there |
| 8 AI agents | Published v1.2 framing already covers agent-ready project knowledge | Review v1.2 agent-ready knowledge rewrite for plain language and a real `AGENTS.md` walkthrough, not an obvious AI comparison |
| 9 Explore information | Dense record table and three perspectives could overwhelm new readers | Open with one contract/delivery question, guide to its answer, then invite free exploration |
| 10 GitHub Actions | Workflow table and runner terms can feel like infrastructure documentation | Start with "What happens when this source changes?" and link detailed workflow mechanics to reference |
| 11 Behind the Lab | Many inventory tables repeat technology described previously | Tell one end-to-end story using the architecture explorer; keep Microsoft 365 comparison and practical conclusion without an extra chapter |

## 7. Implementation architecture (the tutorial, not the universal standard)

| Concern | Current project approach | Required boundary |
| --- | --- | --- |
| Authoritative chapter content | `docs/*.md` with front matter | Don't duplicate edited chapters in site source |
| Supporting materials | `reference/*.md` and other linked sources | Deep detail lives outside chapter sequence |
| Web rendering | Astro in `site/` | Maintained content rendered into output, not manually copied HTML |
| Interactive learning | Astro components + browser JavaScript | No-JS fallback and explicit persistence rules |
| Quizzes | `examples/learning/questions.json` + shared quiz component | Per-chapter prompts test outcomes; not a secure assessment |
| Models/visuals | Mermaid, SVG, source-based charts and explorers | Meaning, provenance, and status survive presentation |
| Presentations | `presentations/*.yaml` → Astro + Reveal.js | Slide selection linked to maintained chapter sources; review synchronization |
| Dashboard | Build-time/history snapshot with opt-in live retrieval | Timestamps and refresh behavior explicit |
| Automation | `.github/workflows/` PR checks, reports, PDF proof, Pages deployment | PR checks and publication are distinct actions |
| Hosting | GitHub Pages under `/document-as-code-lab/` | Serves built static assets; does not execute Python/Astro for visitors |
| Agent workflow | `AGENTS.md`, scoped edits and reviews | Permissions and approval not implied by available files |

**Transferability:** Describe equivalent *capabilities*, not false one-to-one tool equivalence. OneDrive/SharePoint offer managed files and versions; Copilot/agent integrations can retrieve files and, with appropriately configured tools and permissions, modify them; review and automation may be implemented through SharePoint/Power Automate. They do not become Git pull requests by being in the cloud.

## 8. v1.2 functional acceptance and v1.3 editorial criteria

The tutorial has **11 chapters** as the desired finished state. The public repository currently lists 11 chapter sources, with Chapter 12 absent. Confirm that navigation, decks, reference links and a production build reflect the same 11-chapter structure.

1. **Eleven-chapter integrity:** No obsolete Chapter 12 page, navigation, final next-link, slides or source refs; route redirects checked; all book/README references reconciled.
2. **Chapter 8:** Explains agent-ready knowledge and the distinct roles of `AGENTS.md`, project information architecture, conventions, decisions, maintained sources, and validation; one short, useful scenario check; references updated to remove the obvious with/without-context exercise from the default path.
3. **In-context checks:** A **single reusable Astro component** with a structured question source, accessible radio inputs, Check answer, meaningful feedback, optional hint, retry/reset and static fallback; initial approved questions in Ch 5, Ch 6 and Ch 8. No score or forced progression.
4. **Guided Chapter 9:** An inviting first business question above the existing Contract Explorer; direct versus derived connections and proposed status remain accurate. Do not replace the underlying source-based model or make new persisted state.
5. **Visual consistency:** Reuse the current homepage olive/sage, ochre and violet accents, neutral backgrounds, spacing and typography. A small set of calm learning, evidence and supporting-link components; accessible on desktop/mobile. Do not introduce a new JS framework.
6. **Better reference links:** At least one value-led reference entry at a natural point in each relevant chapter, with prerequisite/no-setup context when useful. References stay separate from numbered chapters.
7. **Knowledge architecture:** `AGENTS.md` links to maintained guidance rather than duplicating it. If an architecture map/decision log does not exist, add only a lean, accurate version grounded in real repo structure and agreed decisions. Prefer existing `GLOSSARY.md`, `CONTRIBUTING.md`, tests and schemas where adequate.
8. **Experience and reliability:** Visual review by the owner; correct browser states and source citations; no account or local tools for core path; keyboard/no-JS/mobile behavior checked; all Astro check/build, tests, slides and links pass; deployment verified only after publication.

**v1.3 editorial release acceptance:** Representative before/after passages demonstrate smoother entry, reduced unnecessary repetition, consistent terminology and a stronger narrative bridge for each changed chapter; interaction meaning and source fidelity are unchanged. `CONTRIBUTING.md`, `AGENTS.md` and any editorial guide use consistent optional-exercise and style rules. Avoid overwriting v1.2 component work when it lands.

**Evaluation model:** owner reviews concrete examples and implementation. External reader studies and learner-success statistics are not release gates and must not be claimed. This is an owner-approved design and technically checked learning product.

## 9. Controlled development after v1

**v1.2 work package — one coordinated agent update, seven workstreams:**

1. Update and keep this specification, the reusable template and audit synchronized with approved decisions.
2. Rewrite Chapter 8 and reframe its long reference around project knowledge, `AGENTS.md`, architecture, language, decisions, source authority and checks.
3. Implement reusable in-context scenario checks, initially Ch 5/6/8, with rationale-based feedback and accessibility.
4. Give Chapter 9 a guided entry into its existing Contract Explorer, without rebuilding the graph or changing source data.
5. Apply a restrained chapter-level visual system based on existing site styling.
6. Give supporting references contextual, benefit-oriented entry points.
7. Finish the 11-chapter cleanup across site, content registry, quiz sources, presentation YAML, links and README.

**Delivery approach:** The seven items belong to **one integrated review/update**, but the agent must keep them separable in the diff, preserve existing work, and report verification by workstream. No commit or push without explicit authorization. Technical correctness is checked by CI/local build; content/design approval remains with the owner.

**Design decisions:** See [the decision register](04-DESIGN-DECISIONS.md) and [accepted editorial samples](V1-3-EDITORIAL-DECISIONS.md). Details of typography and spacing may be refined in owner review, but default to the current site palette and avoid rebranding.

### v1.3 Editorial Quality

One integrated **editorial pass** across all 11 chapters and their immediately linked reference invitations. Start from the actual repository after v1.2 is merged; do not blindly overwrite changed chapter text with an old proposed file. Group changes chapter by chapter so the owner can review each diff. Update writing guidance in `CONTRIBUTING.md` and reference it from `AGENTS.md`, rather than hiding the conventions in this specification alone. Include at least three representative before/after examples before requesting owner approval for the editing pattern. Do not launch a second framework or new full-size lab.

**Prioritize:** (a) introduction/flow/terminology, (b) repetition and depth boundaries, (c) bridges between examples and chapters, (d) lab/quiz microcopy, (e) contextual reference-link language, and (f) final editorial and technical verification.

## 10. Targeted reference-pattern decisions for v1.2

| Topic | Agreed direction | Guardrail |
| --- | --- | --- |
| Scenario check | Introduce a real-world decision question beside the concept, Check answer, feedback and optional hint | Never use obvious 'AI with data beats AI without data' contrasts, trivia, compulsory scoring or decorative interactivity |
| Lab feedback | Existing schema and processing engines remain; expose cause and effect accurately | Valid schema ≠ true/approved content; generated ≠ published |
| Guided exploration | Orient with one business question, then offer free exploration of the same nine maintained records | Direct relation ≠ inferred review candidate; proposed amendment ≠ effective |
| Agent readiness | Project guidance links to architecture, terminology, rationale/ADRs, maintained sources and checks | Do not dump everything into `AGENTS.md`; no assumed tool permissions or unsupported claims |
| Visual design | Calm, slightly richer pages using current neutral/sage/violet/ochre tokens; components with semantic purpose | No mandatory image quota, second UI framework, or gratuitous animation |
| Owner evaluation | Present integrated result to owner for acceptance/edits, backed by functional tests | Do not claim learner efficacy without external reader evidence |

**Research provenance:** Brilliant/Khan/Code.org/Observable/Google Arts & Culture/The Pudding provide interaction inspiration, not measured comparative learning proof. Accessibility reference: W3C/WAI; test actual behavior before claiming WCAG conformance.

## 11. Evidence reviewed and limits

Source baseline inspected on 19 October 2026: [repository](https://github.com/And-Gu/document-as-code-lab), [chapters](https://github.com/And-Gu/document-as-code-lab/tree/main/docs), [Astro site](https://github.com/And-Gu/document-as-code-lab/tree/main/site), [decks](https://github.com/And-Gu/document-as-code-lab/tree/main/presentations), [workflows](https://github.com/And-Gu/document-as-code-lab/tree/main/.github/workflows). Ch 10 and Ch 11 rewrites and the Architecture Explorer are on the remote branch. The remote repository now lists 11 chapter files, with Chapter 12 absent. That package inspection preceded the verified v1.2 release. Implementation starts from clean main at `6d8ee1d`, where the agent-knowledge rewrite, three scenario checks, guided Contract Explorer, and eleven-chapter site are published. Preserve those implementations.

The v1.2 implementation record describes its local and hosted functional checks. This editorial revision needs its own regression evidence; neither a full accessibility/performance audit nor wider learning effectiveness is established by the sample approval. The [editorial review](EDITORIAL-REVIEW.md) records the changed reading path and actual checks.

## 12. v1.4 adoption and implementation evidence

The [25 October decision](04-DESIGN-DECISIONS.md#25-october-2026-working-methods-direction) establishes audience and promise. The [working-methods package register](working-methods-upgrade/README.md) sequences three separately reviewable implementation increments. Specification adoption is distinct from implementation, content approval, publication and learning evidence.

Package 1 covers P1-01 through P1-06 and acceptance A01–A08, A15 and A20. The existing architecture and eleven chapters remain. Final text and visual treatment require owner review; no broader style approval is inferred from the audience decision. Packages 2 and 3 remain future work until the preceding implementation is reviewed and merged.
