# Document-as-Code Lab — Learning Product Specification v1.2

> **Proposed implementation baseline · 19 October 2026 · owner-approved direction with a few reviewable design details**\
> Derived from `01-REUSABLE-TUTORIAL-SPECIFICATION-TEMPLATE.md`. **Target:** 11 chapters (owner reports Chapter 12 removed locally; remote still contained it when checked); keep rewritten Chapter 10; Chapter 11's current “Behind the Lab” treatment may be retained, selectively edited, or simplified. This is the **intended specification**, not a claim that everything is implemented or user-tested.

## 1. Product promise

**Reader promise:** Learn how to move from isolated documents to *maintained, processable information* that can be reviewed, connected, transformed, explored, and used by people, software, and AI agents.

**Primary outcome:** A reader can describe a credible Document-as-Code workflow and recognize how source information differs from views, approval decisions, tasks, and publication. They can inspect a working example in a browser and know where to go for a real implementation.

**Secondary outcome:** A practitioner can inspect the tutorial's own GitHub/Astro implementation and adapt its patterns, or recognize analogous approaches using existing document environments such as Microsoft 365.

**What it is not:** A Git training course; a Markdown syntax encyclopedia; a software installation tutorial; a complete CI/CD manual; a mandate to migrate every Word document into Git; or a mandatory hands-on lab course.

**Positioning:** A compact, approachable learning website with purposeful visuals, self-contained browser interactions, source-linked examples, optional deeper references, and actual project evidence. The site illustrates its own subject.

## 2. Audiences and paths

| Reader | Starting position | Core path | Optional next step |
| --- | --- | --- | --- |
| General professional / manager | Uses documents, reports, collaboration tools; limited Git familiarity | Read all conceptual chapters; try browser labs | Explore examples, presentations, Microsoft 365 alternative |
| Practicing engineer / builder | Familiar with code/repositories; wants architecture, checks, reuse, AI | Skim foundations; focus on Ch 5–11 | Inspect scripts, source records, workflows, reference guides |

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

**Editorial decision on Chapter 11:** Its current long form is not automatically rejected. Retain it if the owner judges it a satisfying overview; prune only sections that repeat prior chapters. Chapter 12's *start with one small information flow* message may become a very short optional closing or a supporting reference—not another mandatory chapter.

## 4. Narrative examples and data boundaries

| Example | Role and chapters | Maintained data | Explicit learning boundary |
| --- | --- | --- | --- |
| **Onboarding procedures** | Opening, metadata, processing (1, 4–7) | `examples/onboarding-showcase/` and related examples | Draft/approved procedure state is not execution or publication |
| **Requirement records** | Deeper reference and AI context (5, 7–8 reference) | `examples/structured-content/records/` | Approved requirement ≠ implemented and tested capability |
| **Contract Explorer** | Broader business scenario (9) | `examples/contract-explorer/records/` | Proposed amendment ≠ effective contract; graph traversal ≠ verified impact |
| **This GitHub/Astro repository** | Real-world meta-example (3, 10–11) | Git history, workflows, site code, YAML decks | Published/build-time snapshot ≠ true live feed; successful build ≠ content approval |

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

## 8. v1.2 acceptance criteria

The tutorial has **11 chapters** as the desired finished state. The user reports having deleted Chapter 12 locally; remote `main` still included it when this specification was checked. Never restore a user's uncommitted deletion merely because the remote baseline differs.

1. **Eleven-chapter integrity:** No obsolete Chapter 12 page, navigation, final next-link, slides or source refs; route redirects checked; all book/README references reconciled.
2. **Chapter 8:** Explains agent-ready knowledge and the distinct roles of `AGENTS.md`, project information architecture, conventions, decisions, maintained sources, and validation; one short, useful scenario check; references updated to remove the obvious with/without-context exercise from the default path.
3. **In-context checks:** A **single reusable Astro component** with a structured question source, accessible radio inputs, Check answer, meaningful feedback, optional hint, retry/reset and static fallback; initial approved questions in Ch 5, Ch 6 and Ch 8. No score or forced progression.
4. **Guided Chapter 9:** An inviting first business question above the existing Contract Explorer; direct versus derived connections and proposed status remain accurate. Do not replace the underlying source-based model or make new persisted state.
5. **Visual consistency:** Reuse the current homepage olive/sage, ochre and violet accents, neutral backgrounds, spacing and typography. A small set of calm learning, evidence and supporting-link components; accessible on desktop/mobile. Do not introduce a new JS framework.
6. **Better reference links:** At least one value-led reference entry at a natural point in each relevant chapter, with prerequisite/no-setup context when useful. References stay separate from numbered chapters.
7. **Knowledge architecture:** `AGENTS.md` links to maintained guidance rather than duplicating it. If an architecture map/decision log does not exist, add only a lean, accurate version grounded in real repo structure and agreed decisions. Prefer existing `GLOSSARY.md`, `CONTRIBUTING.md`, tests and schemas where adequate.
8. **Experience and reliability:** Visual review by the owner; correct browser states and source citations; no account or local tools for core path; keyboard/no-JS/mobile behavior checked; all Astro check/build, tests, slides and links pass; deployment verified only after publication.

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

**Design decisions:** See companion `04-DESIGN-DECISIONS.md`. Details of typography and spacing may be refined in owner review, but default to the current site palette and avoid rebranding.

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

Source baseline inspected on 19 October 2026: [repository](https://github.com/And-Gu/document-as-code-lab), [chapters](https://github.com/And-Gu/document-as-code-lab/tree/main/docs), [Astro site](https://github.com/And-Gu/document-as-code-lab/tree/main/site), [decks](https://github.com/And-Gu/document-as-code-lab/tree/main/presentations), [workflows](https://github.com/And-Gu/document-as-code-lab/tree/main/.github/workflows). Ch 10 and Ch 11 rewrites and the Architecture Explorer are on the remote branch. The remote branch still exposed `docs/12-automation.md` even though the owner reports deleting Chapter 12 locally; interpret this as an unsynchronized baseline, **not** a request to restore that chapter.

No rendered-browser accessibility, mobile, or performance audit has yet been completed, and no wider-reader learning-effectiveness result is claimed. The implementation agent should report observed verification results from its workspace and from the actual site, when available.
