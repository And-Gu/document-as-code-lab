# Document-as-Code Lab — v1.2 Audit and Coordinated Improvement Plan

> 19 October 2026 · owner-reviewed design baseline · **implementation plan, not a completed site change**
>
> Source: [GitHub repository](https://github.com/And-Gu/document-as-code-lab). Scope: intended 11-chapter tutorial, browser-first, concise chapters, existing Astro stack. No external reader testing required at this stage.

## 1. Baseline, verification levels and what changed since v1.1

This audit is an update to the original source-level review, not a claim that the actual rendered site or user experience has been independently validated. The source tree on public `main` was inspected on 19 October 2026. The user's workspace is authoritative for their reported Chapter 12 deletion; remote `main` still contained `docs/12-automation.md` at inspection time. **Do not reintroduce Chapter 12 from remote merely to align branches.** Recheck the agent workspace before changing files.

| Area | Source-grounded observation | v1.2 target |
| --- | --- | --- |
| Curriculum | 12 Markdown chapter files on remote; new Ch 10/11 content already present | 11 chapters, Chapter 11 final, links/decks/tests reconciled |
| Chapter 8 | [`docs/08-ai-native.md`](https://github.com/And-Gu/document-as-code-lab/blob/main/docs/08-ai-native.md) prioritizes a single briefing task and prompt/context selection | Agent-ready **project knowledge architecture**, with `AGENTS.md` as entry point, not repository encyclopedia |
| AI reference | [`reference/ai-context-and-agents.md`](https://github.com/And-Gu/document-as-code-lab/blob/main/reference/ai-context-and-agents.md) still features a task-only versus supplied-context exercise | Longer practical guide to repository instructions, architecture, conventions, decisions, source authority, permissions and validation; move task-only comparison out of primary lesson |
| Learning interaction | Shared end quiz plus working labs; [`ChapterLearning.astro`](https://github.com/And-Gu/document-as-code-lab/blob/main/site/src/components/learning/ChapterLearning.astro) mounts known markers | Add a **separate** no-score, in-context scenario-check component, initially Ch 5/6/8 |
| Exploration | Ch 9 Contract Explorer offers relationships, commitments and impact, with real source-backed records | One clear guiding question and safe initial path; existing free explorer, provenance and static alternatives remain |
| Visual identity | Homepage has strong imagery, icon flow and grouped learning routes; chapter layout mostly plain | Extend existing neutral/sage/olive, muted violet and ochre accents to a few reusable **semantic** chapter elements |
| References | Rich reference library, but links often generic prose with uncertain value | Relevant questions leading to specific supporting information; no forced detours or duplicate masters |
| Release dependency | At least 7 references to `docs/12-automation.md` across `information-model.yaml`, `information-value.yaml`, `lab-architecture.yaml`; Ch 11 next link and homepage groups include 12 | Remove or redirect all deprecated links, reassign presentation sources semantically, delete orphan question(s), test complete build |

**Evidence categories:** `Observed in source`, `Owner decision`, `Proposed implementation`, `Agent-verified behavior`. Keep these separate in final reporting. Technical tests provide confidence that an interface works; they do not prove learning effectiveness among all audiences.

## 2. What is now approved and what is not

**Approved directions:** 11 chapters; no required local homework; concise narrative with reference depth; on-page, scenario-based knowledge checks with rationales and no score; guided Chapter 9 exploration; purposeful, restrained visuals; benefit-led supporting links; Chapter 8 about making structured project information useful to agents; owner review in place of formal learner-study gates.

**Decisions delegated to this implementation (conservative defaults):** Keep existing site colors and Astro architecture. Reuse existing glossary/editorial conventions. Introduce an initial question set in Ch 5, Ch 6, Ch 8; do not require one per chapter. Keep Chapter 11's narrative mostly intact except for stale links and obvious inaccuracies. Create architecture/decision documentation only after inspecting existing sources, and make documents short and explicitly versioned.

**Still subject to owner evaluation:** Final visual spacing/appearance; final exact question wording; whether a new `PROJECT-KNOWLEDGE.md` or a narrowly extended existing source is preferable; whether to adopt the proposed Chapter 8 title verbatim. These may be implemented as reviewable candidates in the one coordinated update—no blocking user questionnaire is necessary.

## 3. Seven improvements, one integrated change

Priorities below are *relative risk and dependency*, not separate delivery cycles. Implement all seven in one integration effort; keep affected parts individually reviewable.

| Workstream | Priority | Requested change | Acceptance evidence |
| --- | --- | --- | --- |
| **IMP-01 Specification and decisions** | P0 | Update reusable template, lab specification, audit and design-decision record to v1.2; explicitly owner-led approval | Specifications agree on 11 chapters, Chapter 8 goal, new interaction pattern and nonmandatory exercises |
| **IMP-02 Chapter 8 / agent knowledge** | P1 | Rewrite chapter using maintained project knowledge example; make AI reference guide support AGENTS/information architecture/glossary/ADRs/authority/checks | No contrived prompt-only comparison in primary teaching; factual paths; one meaningful scenario-check; chapter/reference separation |
| **IMP-03 Reusable scenario checks** | P1 | Single data-driven accessible Astro component, in context, with no score or progress gate; start in Ch 5,6,8 | Correct outcomes + rationales + optional hint + retry; keyboard; no-JS explanation; no extra global quiz machinery |
| **IMP-04 Guided Ch 9 exploration** | P1 | Brief business question and clear first step toward AMD-001 → DEL-101 → DEL-102; preserve free exploration | One click/selection path discoverable; proposed amendment is not effective; direct vs derived distinguished; no cloned dataset |
| **IMP-05 Visual language** | P1 | Reuse existing accents for inline concept/prompt, output/result, source/provenance and reference cards; meaningful drawings only when they simplify | Focus/contrast/mobile checked, consistent spacing, not every section boxed; stable source captions |
| **IMP-06 Supporting links** | P1 | Upgrade benefit-led links near questions in Ch 2–11 as applicable, and distinguish optional local references | Each important reference has natural entry point; links resolve; reader can return to chapter; no duplicative content |
| **IMP-07 Eleven-chapter release integrity** | P0 | Treat Ch 12 as deleted; remove stale navigation, slide references, quizzes/tests, README counts and Next link; retain useful adoption message only if appropriate | 11 pages and sequenced navigation; all slides render; no reference to removed docs/12; build succeeds |

**One change package** does not mean one giant unrelated diff. The agent should report files and verification by workstream. Do not delete needed historical resources unless directly obsolete.

## 4. Implementation dependencies and source-of-truth risks

- `site/src/lib/presentations.ts` verifies deck `sources[]` against current chapter files. Repoint *seven* known mentions of `docs/12-automation.md` by their **actual slide meaning** (not blind search-and-replace), usually to Ch 1, 7, 10 or 11; adjust slide copy if needed.
- `site/src/pages/index.astro` groups Chapter 11–12 under 'Applying the approach'; change to single Ch 11 or reframe group labels while keeping all 11 chapters visible. Chapter pages and quiz data must be reconciled. Check old route redirects (`site/astro.config.mjs` etc.) without broken nav loops.
- Existing `AGENTS.md` already distinguishes `docs/` versus `site/`, stable IDs, writing in English, references, checks and don't commit/push without authorization. Do not overwrite those rules. Improve discoverability via links, not copy/paste.
- Existing Ch 9 records (`examples/contract-explorer/records/`) and transformer are authoritative. **Do not create another nine-record JSON** for a guided demonstration.
- Original Ch 8 frontmatter stable `id` is `04-ai-native`; keep it even if headline and learning goal change. New Mermaid source should match diagram metadata; do not leave old contradictory captions.
- `reference/ai-context-and-agents.md` may retain optional technical sections on RAG/file retrieval, access boundaries, actual record processor and review evidence; remove/relegate the simplistic prompt comparison and inconsistent old chapter links.
- Inline scenario checks must complement, not blindly duplicate, the two existing end-of-chapter quiz questions. Existing scoring quiz may remain after editorial review.
- Site components should use proper form controls and status messages; do not add an extra framework, backend, external inference service, tracking or persistence.

## 5. Design criteria to verify

### Content and learning

1. Ch 5 asks whether syntactically valid metadata establishes a correct owner; feedback explains schema validity ≠ semantic accuracy/approval.
2. Ch 6 asks how to respond when a referenced policy changes; feedback explains linked items are review candidates, not automatically rewritten.
3. Ch 8 asks where identifier rules and their rationale belong; feedback distinguishes information model, decision log and AGENTS entry point. Real project docs, not invented capabilities.
4. Ch 9 begins with a real reader question: if proposed AMD-001 were accepted, which deliveries would deserve review? Reader can inspect direct DEL-101 and dependent DEL-102 in the current explorer.
5. Reference teasers tell what the linked page helps the reader do and whether it needs local tools.
6. Ch 11 ends the tutorial with no mandatory extra chapter; reuse architecture explorer and presentation, no unnecessary rewrite.

### Technical and UX

- Astro `npm run check`, `npm run build`, site-specific tests (`test:learning`, `test:content`, `test:homepage`, `test:contracts`, and any new scenario test), plus Python tests where changed.
- One sample question in each supported type has an automated correctness/rationale test, accessibility semantics, safe HTML and no-JS fallback.
- Keyboard-only use, focus outlines, relevant status announcement, try-again flow, narrow/mobile readability; no critical information conveyed through color alone.
- Working links into materials, source files, `presentations` and affected diagrams from the production base path `/document-as-code-lab/`.
- Prevent false publication/approval claims. Existing browser labs are simulations; the dashboard mixes build-time snapshots with explicitly opt-in live API retrieval.
- Agent must report actual results and any unverified rendering/deployment; **do not claim a live deployment** unless it occurs and is inspected.

## 6. Owner review checklist

Before accepting the single coordinated update, inspect representative rendered pages: Ch 5 (metadata check alongside editor), Ch 6 (traceability scenario), Ch 8 (new agent knowledge content and scenario), Ch 9 (guided Contract Explorer), Ch 11 (concluding architecture), homepage and one reference page. Confirm that the visual design enhances rather than crowds the concise prose. Inspect a deck referencing removed Chapter 12 to confirm slides still have meaningful sources.

**Decision outcomes:** `Accept`, `Request revision`, or `Reject design element`. The owner judges meaning and visual quality. The agent provides technical evidence; neither party needs to claim statistically validated learning outcomes.

## 7. Remaining optional opportunities after v1.2

Later, consider a richer Chapter 6 relationship view or entirely new Digital/Agentic Engineering demonstrations **only if** they introduce a distinct learning capability. Do not build a second graph engine, AI chat widget or artificial progress-tracking system as part of this update. Site analytics, formal reader studies and performance optimization can be added if a concrete need emerges; they are not blocking v1.2.

## 8. Research basis and limits

References from the previous audit still apply: [Brilliant](https://brilliant.org/faq/) for small decision problems; [Khan Academy](https://blog.khanacademy.org/how-should-people-practice-on-khan-academy/) for hints; [Code.org](https://support.code.org/hc/en-us/articles/15715302033549-Level-Validation-in-Java-Lab) for action versus validation; [Observable](https://observablehq.github.io/documentation/inputs/overview) and [The Pudding](https://pudding.cool/) for purposeful exploration; [NN/g](https://www.nngroup.com/articles/progressive-disclosure/) for layering details; [W3C WAI](https://www.w3.org/WAI/tutorials/) for accessibility. These provide patterns, **not experimental proof** of comparative benefits for this tutorial. Current baseline comes from source inspection, not a full rendered browser or accessibility audit.
