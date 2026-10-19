# Reusable Specification Template — Interactive Technical & Professional Tutorial

> **Template v1.3 · 19 October 2026 (editorial direction accepted after sample review)**\
> Purpose: describe a *learning product* before implementing chapters and website features. Copy this file into a new tutorial project and replace `[TBD]` fields. Mark each requirement **MUST**, **SHOULD**, **MAY**, or **NOT APPLICABLE**. The template is intentionally platform-neutral: Astro/GitHub is one possible implementation.

## 0. Specification identity and decisions

| Field | Value |
| --- | --- |
| Tutorial name / short promise | [TBD] |
| Specification version / status | [v0.1 / draft] |
| Content version and intended release | [TBD] |
| Owner and reviewers | [TBD] |
| Primary language and locale | [TBD] |
| Primary / secondary reader | [TBD] |
| Delivery channels | [Website, downloadable, slides, other] |
| Hosting / source repository | [TBD] |
| Out of scope | [TBD] |
| Decisions still open | [TBD] |

**Decision record.** Track significant choices using `Decision · rationale · alternative · status · date`. Do not treat tentative design ideas as verified capabilities.

## 1. Product intent and reader value

**Problem:** [What learning problem does the tutorial solve?]\
**Promise:** After using it, readers can [observable capability].\
**Why now:** [Why does this matter to them?]\
**Differentiation:** [What can a reader do here that another article/book cannot provide?]\
**Owner acceptance:** [How will the tutorial owner decide the experience communicates the intended insight?]
**Optional future reader evidence:** [How broader audience testing could be added later without blocking current delivery.]

Define no more than 3–5 overall learning outcomes. Prefer verbs such as *identify, distinguish, explain, inspect, evaluate, apply,* or *build*, not merely *understand*.

### Reader profiles and entry routes

| Profile | Starting knowledge / constraints | Desired job-to-be-done | Suggested path | Needed accommodation |
| --- | --- | --- | --- | --- |
| [Non-technical professional] | [TBD] | [TBD] | [TBD] | [TBD] |
| [Practicing engineer] | [TBD] | [TBD] | [TBD] | [TBD] |

State prerequisites explicitly. **MUST:** Core learning works in a browser without a local installation or external account. **MAY:** Offer a clearly labeled advanced local track.

## 2. Learning model and curriculum architecture

**Narrative arc:** `[Why it matters] → [How it works] → [What it enables] → [How to apply it]` (adapt to the subject).

**Groups** should represent distinct stages of capability, not arbitrary chapter counts.

| Group ID | Name | Reader question | Entry knowledge | Group-level outcome | Chapters |
| --- | --- | --- | --- | --- | --- |
| G1 | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |
| G2 | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |

**Progression rule (MUST):** Every chapter contributes a demonstrably new insight or capability. Delete, merge, or move redundant material into a reference. Record conceptual prerequisites, transitions between examples, and the *one question* each chapter answers.

### Chapter contract — repeat for every chapter

```yaml
number: 0
slug: short-stable-slug
title: "[Conversational, reader-oriented title]"
group: G1
reader_question: "[Question answered by this chapter]"
learning_outcome: "[Observable capability]"
prerequisites: []
key_concepts: ["[maximum 3–5]"]
not_in_scope: ["[What belongs elsewhere]"]
scenario: "[Common example or new example with clear handoff]"
narrative:
  reader_motivation: "[What real reader problem opens the chapter?]"
  opening_example: "[Concrete situation before extended terminology]"
  new_insight: "[What is genuinely new here, not repeated from earlier chapters?]"
  transition_in: "[What from the previous chapter is assumed?]"
  transition_out: "[What question remains for the next chapter?]"
  avoid_repeating: ["[Ideas already taught elsewhere]"]
evidence_or_source: ["[Which maintained records or verified facts]"]
primary_visual:
  purpose: "[What becomes clearer?]"
  type: "[diagram, before-after, annotated UI, graph, illustration, none]"
learning_interaction:
  mode: "read-only | quiz | on-page-lab | optional-local | combined"
  action: "[What the reader actually does, if anything]"
  feedback: "[What new understanding the response reveals]"
  loop: "observe-only | predict-act-observe-explain | guided-discovery | exploration"
  first_action: "[One safe, intelligible action or choice; optional if not appropriate]"
  hints: ["[Optional first nudge]", "[Optional worked explanation]"]
  state_visibility: "[What is current, modified, valid, generated, saved, or published?]"
  reflection: "[One-sentence explanation of why the result matters]"
  reset_or_recovery: "[How readers safely retry or undo without losing track]"
scenario_check:
  enabled: false # optional; decide based on genuine misconception
  misconception: "[What plausible but wrong interpretation is examined?]"
  answer_feedback: "[Why is the chosen decision justified?]"
  no_score: true
supporting_links:
  - target: "[Stable link to a reference or external source]"
    reader_benefit: "[Concrete answer or useful capability at destination]"
    placement: "[At point of need; optional deeper reading]"
completion_signal: "[How reader knows they got it]"
next_chapter_bridge: "[Why the next chapter follows]"
acceptance_checks: ["[2–4 observable tests]"]
```

**Editorial structure (SHOULD):** Start with a concrete question or surprise; show the core example; introduce no more than a handful of new concepts; demonstrate the result; offer one optional path deeper; end with a meaningful takeaway and a transition. A chapter does **not** need every section in the same order.

**Length guidance:** Aim for roughly 500–850 words of core prose. A complex, valuable chapter may be longer; shorten *repetition*, not useful explanation. Keep implementation tutorials and lengthy source listings in references.

### Editorial voice and reading-flow contract (MUST for reader-facing chapters)

**Intended voice:** direct, warm, clear, intellectually respectful, and practical. Write for a curious professional who may not know Git, Astro or YAML but is capable of complex reasoning. Explain ideas, not just labels. Avoid marketing language, lectures, artificial enthusiasm, and school-style homework framing.

**Narrative sequence (flexible, not mandatory headings):** reader problem or question → concrete example → the smallest necessary explanation → diagram or interaction where it clarifies → insight/consequence → natural transition. Begin with the *reader's reason to care*, not a list of chapter objectives or a recap of the previous chapter.

**Paragraph/section review rules:**
- One central idea per paragraph; favor active verbs and specific actors over abstract nouns or excessive passive voice.
- Introduce unfamiliar terms *when* they become necessary. Define a term once; afterward use it consistently and link to the glossary rather than redefine it in every chapter.
- Explain cause and consequence. Prefer "If the source changes, the guide can be rebuilt" to a string of nouns such as "source-based transformation enables repeatable publication".
- Use **you** for reader actions, **we** sparingly for a shared walkthrough, and the project's actual actors when describing approvals and responsibilities. Avoid unexplained shifts in viewpoint.
- Prefer a short paragraph to a numbered list when the content is a coherent thought. Use tables only for meaningful comparisons or structured reference—not to interrupt a story with a mini-glossary.
- Keep constraints and qualifications *close to the claim or result they qualify*, especially approval, status, permissions, live vs snapshot and inferred impacts. Do not delete important distinctions merely to shorten text. Eliminate **duplicate** disclaimers, not their meaning.
- Avoid excessive "in this chapter", "as we have seen", "what to remember", "this demonstrates", repeated "maintained information", and generic handoffs. Use a natural opening and closing instead of formulaic headings where possible.
- Prefer short headings that reveal a reader question or insight over mechanical topic labels. Make scanning easy without turning every paragraph into an isolated callout.
- Writing length is a guide, not an optimization metric. Reduce repeated explanations and weak framing before cutting useful examples. Never use an automated word-count target as a proxy for quality.

**Across-chapter continuity (MUST):** Maintain a curriculum map with the example in use, previously established knowledge, the single new insight, and the next reader question for each chapter. Whenever the example changes (onboarding → agent working environment → contracts → this site's real architecture), include one or two sentences explaining *why the new example is useful*. Maintain consistency of names, status meanings and source identity.

**Interaction microcopy (MUST when present):** Introduce the situation in everyday language, use one clear action verb on the control ("Check answer", "Validate metadata", "Explore relationships"), report what happened, and explain *why* it matters. Avoid "Correct!" as the entire feedback and never imply that green means approved. Hints, reset and data-persistence explanations must be easy to find without crowding the narrative.

**Supporting-link wording (SHOULD):** Say what the reader will learn or be able to do, not merely "Read more". Links to technical implementation or local exercises declare prerequisites and remain optional. Link labels must remain descriptive out of context.

**Accessibility of language:** Acronyms are expanded at first meaningful use, examples are understandable without color or figure position, link purposes are explicit, and captions convey the conclusion rather than restating shapes. Prefer everyday language without becoming patronizing.

### Editorial acceptance review (owner-led)

Review every proposed chapter change with five checks:
1. **Opening:** Is the reader's question clear within the first ~100 words without making false claims?
2. **Flow:** Can we follow the explanation from example to insight without a conceptual leap or a long detour?
3. **Novelty:** What does this chapter add that earlier chapters did not?
4. **Economy:** Can a sentence, list, table or qualification be cut or moved to a supporting page *without losing meaning*?
5. **Finish:** Does the reader leave with one useful understanding and a natural reason to continue or go deeper?

Submit a **before/after excerpt, a short explanation of editorial intent, and a map of changed references** for owner evaluation. Build/lint automation catches broken files, not awkward prose. Read-aloud and skim reviews are editorial techniques, not quantified learning evidence. Do not require participant testing or invented readability scores.

## 3. Examples, stories, and source fidelity

Create an **example register**. A single evolving example can teach progression; a new example can broaden applicability, but the transition should be explicit.

| Example ID | Reader problem | Appears in | Maintained source | Fictional or real | What it demonstrates | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| EX-01 | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |

**MUST:** Distinguish source facts, illustrative assumptions, inferred relationships, and generated outputs. Never represent a fictional dashboard, unsent request, unexecuted test, or draft as a live or approved result.

**SHOULD:** Reuse one example across chapters when it reinforces progression. Avoid forcing a domain-specific example on readers when a business, logistics, public-sector, or engineering example would better explain the concept.

## 4. Engagement model: visual, interactive, or simply clear?

Choose the **least demanding interaction that makes the learning better**. An exercise is *not* a mandatory ingredient.

| Mode | When to use | Reader experience | Required result |
| --- | --- | --- | --- |
| **Worked example** | A concept is best understood by inspection | Read / compare a concrete case | Clear explanation of what it shows |
| **Quick quiz** | Test a key distinction or misconception | Answer 1–3 meaningful questions | Immediate explanatory feedback; retry |
| **On-page lab** | A changed input demonstrates cause-and-effect | Select, edit, filter, run, compare | Immediate, accurate feedback; reset; no account |
| **Interactive explorer** | Navigating or querying connected information matters | Follow objects or switch views | Traceable data, not theatrical interaction |
| **Optional local exercise** | Real tooling teaches something browser simulation cannot | Clone, run, inspect | Clearly optional, reproducible, with expected outcome |
| **External reference/demo** | Detail, specialized tools, or an existing authoritative resource | Leave chapter by choice | Value proposition, destination, and return path |

**MUST:** No inert controls. Interactive widgets state whether data are fictional, build-time snapshots, current/live, or locally edited, and whether actions persist. Include non-JavaScript or accessible alternatives. Never make an off-site tool, paid account, installation, or homework a hidden prerequisite for a core chapter.

### Activity micro-lesson contract (SHOULD for labs, not every chapter)

The reusable pattern is **invite / predict → act → observe → explain → explore further**. Choose the smallest useful subset, not a mandatory six-screen wizard:

1. **Orient.** Name the question and expected action in plain language, before showing all controls.
2. **Predict or attempt (optional).** Ask one low-stakes question *before* revealing the answer when the reader has enough context to make a meaningful prediction. Offer a **Show an example / Give me a hint** path immediately when they do not.
3. **Act.** Let the reader change one variable or make one selection; keep the relevant output visible alongside the source when space permits.
4. **Observe.** Give an unmistakable result, diagnostic, or visual change. Explicitly distinguish a *preview*, *validated result*, and *published output*; don't automatically claim that a change was checked or saved.
5. **Explain.** Provide a one- or two-sentence causal explanation, including why a valid result can still be semantically wrong.
6. **Explore further.** Offer reset/retry, an optional second variation, and a benefit-led reference link. Avoid compulsory multi-step tasks or tracking-based completion incentives.

**MUST for an implemented lab:** A self-explanatory first action; outcome and error feedback near the control; optional help or a worked example; safe retry/reset; an understandable learning takeaway; accurate state labels; keyboard/focus/status-message support. The learner must not have to finish an activity to continue reading. **SHOULD:** Do not interrupt every input with a modal or repetitive 'incorrect' toast; support an iterative edit–check cycle. *Instantly showing changed preview is appropriate; instantly validating an unsubmitted draft may be misleading.*

**Source of pattern:** Brilliant's guided, bite-size problems and immediate feedback; Khan Academy's optional progressive hints and rationales; and Code.org's distinction between seeing a run result and passing a validation check. These are design inspirations—not independent evidence that copying a branded interface will improve learning. See §10.

### Data exploration and visual storytelling (SHOULD when a graph is central)

Follow **orient → focus → manipulate → interpret → inspect source**. Begin with one useful relationship or question, reveal additional controls on request, and keep data definitions/provenance available. Borrow the idea of guided depth from Google Arts & Culture and connected inputs/views from Observable. Borrow restrained narrative pacing from The Pudding; do **not** introduce scroll-driven animation unless it teaches something beyond a static view. Preserve a keyboard-usable list/table alternative.

**Quiz criterion:** Distinguish an **in-context scenario check** from an optional end-of-chapter quiz. A scenario check is a self-contained practical decision with 2–4 plausible answers, explicit Check answer, immediate rationale, optional hint/retry, and **no score, streak or persisted completion**. Put it next to the relevant concept. It is NOT mandatory in every chapter. The general quiz can remain where it probes a different outcome; omit or trim repetitive questions.

**Optional exercise criterion:** Only include a procedure if hands-on execution adds a skill that the browser cannot teach. Mark `Optional: 5–15 minutes`, prerequisites, expected result, restore/reset steps. Do not silently turn the tutorial into a homework course.

## 5. Supporting content and deliberate cross-linking

References, glossary entries, downloadable artifacts, demonstrations, presentation decks, and source files are **complementary products**, not chapters hidden in the navigation.

| Supporting asset | Intended reader question | Chapter entry point | What the link promises | Update owner / cadence |
| --- | --- | --- | --- | --- |
| [Reference article] | [TBD] | [TBD] | [TBD] | [TBD] |
| [Presentation] | [TBD] | [TBD] | [TBD] | [TBD] |

**Discovery rule (SHOULD):** Link at the moment the reader encounters the question. Use descriptive text that *sells the benefit*, e.g., “**Want to test this with your own records?** Open the 10-minute validation guide,” rather than “See reference.” Show expected effort and prerequisites when relevant. Keep a route back to the chapter. Optional depth must not be required to understand the core sequence.

**Reference rule (MUST):** One subject has one primary maintained explanation. Summarize its intent in the chapter; maintain commands, edge cases, and tool versions in the reference. Avoid duplicating detailed instructions in multiple pages.

## 6. Visual language, design system, and UX

**Desired experience:** `[e.g., calm, modern, inviting, precise; not a dense technical manual]`.

**Visual vocabulary** — define a modest system: colors/tokens, typography, spacing, cards, illustration style, diagram style, icon rules, light/dark assumptions, and captions. Prefer purposeful graphics over decoration.

| Visual pattern | Purpose | Example |
| --- | --- | --- |
| Concept illustration | Establish setting or human consequence | People interacting with maintained information |
| Before/after comparison | Show why a method matters | Three copies versus one source and generated views |
| Annotated workflow | Explain process with ownership and boundaries | Proposal → check → review → publish |
| Interactive graph / dashboard | Reveal connections or allow questions | Click a contract and inspect linked deliveries |
| Evidence panel / source card | Preserve context and provenance | Source revision, status, last refreshed |

**Progressive disclosure rule (SHOULD):** Show the essential action and result first; put advanced schemas, full Git provenance, options, and implementation details in explicitly labeled expandable or secondary views. Important safety/status qualifications must *not* be hidden.

**Feedback and completion rule (SHOULD):** After a successful activity show a small, calm “What this demonstrated” statement. Never confuse lesson completion, schema validation, approval, and publication. Errors should explain how to recover; users can skip or retry without penalty.

**Page requirements (MUST/SHOULD):** Consistent hierarchy; restrained line length; readable code/tables on mobile; obvious chapter progress and navigation; visible links and focus states; accessible keyboard and screen-reader interactions; descriptive alt text and captions; no important color-only meaning; explicit loading/error/empty states. Target **WCAG 2.2 AA** and verify, rather than claiming compliance from code inspection alone. Design is allowed to feel warm and graphical without distracting from learning.

**Per-chapter design choice (SHOULD):** At least one *meaningful* visual moment, unless the best representation is text. No arbitrary image quota; no placeholder diagrams repeating prose. Prefer reuse of layout/visual primitives to manually styling each chapter.

**UX verification plan:** Owner reviews representative desktop and mobile renderings and tests narrow tables/code, keyboard-only operation, no-JavaScript behavior, contrast, image alternatives, discoverability of labs, and return navigation from references. Include realistic focus traversal across tab controls, accessible status announcements, and whether hint/retry/reset flows make sense. Test visuals at 200% zoom and with reduced-motion preferences. Use W3C WAI tutorials and ARIA Authoring Practices as implementation references; the A11y Project checklist and axe/Lighthouse are *supporting checks*, not proof of WCAG conformance.

**Performance evidence (SHOULD for public sites):** Sample the homepage and one heavy interactive page using PageSpeed Insights/Lighthouse and, where sufficient field traffic exists, Search Console or Chrome UX Report. Track Core Web Vitals **LCP, INP, CLS** (current 'good' guidance: ≤2.5 s, ≤200 ms, ≤0.1 at the 75th percentile); benchmark actual measured performance rather than assume that Astro/static hosting is fast. Lighthouse alone does not measure real-user INP. Do not introduce invasive learner surveillance or a performance dashboard without a decision it supports. No external learner sessions are required for owner-led design acceptance. If later claiming demonstrated learning effectiveness across audiences, gather separate reader evidence; do not infer that claim from owner approval.

## 7. Technology architecture — choose, do not presume

| Concern | Requirement | Selected implementation | Notes / alternatives |
| --- | --- | --- | --- |
| Maintained content | Identifiable and reviewable sources | [Markdown / docs / database] | [TBD] |
| History and collaboration | Changes inspectable | [Git/PR; M365 versions/approval] | [TBD] |
| Metadata / relationships | Processable and validated | [YAML/schema] | [TBD] |
| Rendering | Separate maintained content from outputs | [Astro etc.] | [TBD] |
| Interaction | Browser-first and accessible | [JS islands/components] | [TBD] |
| Visuals | Editable/generatable sources retained | [Mermaid/SVG/charts] | [TBD] |
| Presentations | Reuse and trace source material | [YAML + Reveal.js] | [TBD] |
| Automation | Checks and builds repeatably triggered | [GitHub Actions etc.] | [TBD] |
| Hosting | Published output with known revision | [GitHub Pages etc.] | [TBD] |
| AI tools | Bounded context and review | [Agent instructions + tools] | [TBD] |
| Analytics/privacy | Measure learning without unnecessary tracking | [TBD] | [TBD] |

**MUST:** Distinguish content source, generated output, publication, approval, and browser state. Document how one source change flows to relevant outputs. Access to a file is not the same as agent authorization to edit/publish it. An integrated Microsoft 365/SharePoint workflow may implement comparable principles but does not automatically supply Git branches or PRs.


### Agent-ready project knowledge (SHOULD when agents maintain the tutorial)

Separate **agent working instructions** from **maintained project knowledge**. Define or link to the actual source for each topic—do not create parallel copies simply to fill a template.

| Topic | Question to answer | Preferred home |
| --- | --- | --- |
| Entry point | Where should an agent start, what can it edit, and what checks must run? | `AGENTS.md` or tool-specific equivalent |
| Information architecture | Where are source objects, their identifiers, relationships, generated outputs and authoritative boundaries? | Project architecture guide or information model |
| Language and terminology | Which terms, tone and naming rules are agreed? | `GLOSSARY.md` / `CONTRIBUTING.md` or equivalent |
| Decisions | Which choices were made, why, what supersedes what, and what remains open? | Dated decision log / short ADRs |
| Authoritative sources | Which files, repositories or systems govern factual claims? | Maintained content, schema and source registry |
| Checks and rights | What must be tested, who may approve changes, and what information may the agent use? | Validation guides, policies, pipeline definitions |

`AGENTS.md` should be short, navigable and specific about scope; it must not pretend that all agent frameworks recognize it equally, that linked material is loaded automatically, or that file access grants permission to edit, publish, or disclose it. A decision log explains rationale rather than substituting for requirements. Source status, accuracy, authorization and deployment are independent.

**Owner approval:** Show any proposed new knowledge files and ADRs to the owner as a diff against existing guidance. Add only content supported by real decisions; mark unresolved choices `proposed` rather than fabricating acceptance history.

## 8. Content quality, evidence, and safety

**Editorial rules:** Follow the chapter voice and reading-flow contract above. For the target project, link `CONTRIBUTING.md`, its glossary and an adopted editorial style guide; do not leave the instructions as generic placeholders. Preserve technical precision, source status and intended meaning.

**MUST:** Technical claims link to suitable current sources; examples are clearly fictional or verified; no invented current capabilities; defined terms are consistent; specific version/tool claims are checked before publication; rights and attribution of media are recorded; sensitive or proprietary examples are not uploaded to public or external AI services.

**Agent-assisted change protocol:** A task should identify scope, authoritative source files, dependent outputs, non-goals, checks to run, and evidence to report. An agent proposes reviewable changes and does not equate a successful build with content approval. **AGENTS.md is a navigation and working-rules entry point, not the single master copy of project knowledge.** Keep a human decision point for meaning and audience fit.

## 9. Acceptance, measurement, and controlled improvement

### Owner-led design approval (MUST for this project's current phase)

1. **Propose:** State the learning problem, a recommended solution, a simpler alternative, and what should become easier to understand.
2. **Demonstrate:** Supply complete chapter text, a renderable example or lightweight interactive preview, and explain changes to the reader journey.
3. **Decide:** The tutorial owner accepts, requests changes, or rejects; record the decision and rationale. **No external learner-study gate is required.**
4. **Implement:** The coding agent applies all approved changes to maintained sources; never substitute an AI-generated mockup for a working HTML component.
5. **Verify:** Check correctness, navigation, source fidelity, accessibility and responsive behavior, production build, and presentation links. Show actual output to the owner for final sign-off.

**Release gates:**

- **Editorial:** Distinct learning outcomes; concrete, reader-oriented openings; coherent paragraph and chapter transitions; limited redefinition and repetition; accurate qualifications; natural ending; benefit-led reference invitations. Owner reviews representative before/after passages.
- **Learning design:** Contextual questions test genuine misconceptions; labs connect action to consequence; help is available without forcing extra steps.
- **Information:** Stable IDs, accurate authority/revision/status claims; no fabricated agent capabilities or approvals.
- **Implementation:** Source validation, Astro checks/build, route/link tests, interactive tests, keyboard and mobile checks, presentation source validation, deploy verification if published.
- **Presentation:** Visual hierarchy and components are consistent with the site's existing design vocabulary; the owner has seen examples before site-wide rollout.

**Do not claim broad educational efficacy from owner review.** Qualify it as owner-approved educational design plus technical verification. Future reader studies, analytics and Core Web Vitals may inform later iterations but are not prerequisites now.

**One coordinated update may address multiple agreed improvements** when their shared components/dependencies make that economical; organize as reviewable commits or change groups and deliver one integration checklist. Record: `Decision ID · problem · proposed solution · owner status · rationale · affected artifacts · verification`.

## 10. External interaction patterns: research register

These are **direct reference sources** for individual patterns, not templates to copy wholesale. Blog-list rankings are weak comparative evidence; official product descriptions demonstrate intended patterns but not their learning effectiveness on our audience. Adopt a pattern after a concrete demonstration and explicit owner approval; broader reader observation is optional future research.

| Source / confidence | Pattern worth testing | Translation to a tutorial lab | Guardrail |
| --- | --- | --- | --- |
| [Brilliant](https://brilliant.org/faq/) · official product description | Bite-sized attempts with immediate explanations | Put a meaningful prediction near the first control | Do not require a guess when no prerequisite knowledge exists |
| [Khan Academy](https://blog.khanacademy.org/how-should-people-practice-on-khan-academy/) · learning-team guidance | Hints during attempts; rationales afterward | Optional layered hint + short causal feedback | No answer dumping or penalized hint use |
| [Code.org](https://support.code.org/hc/en-us/articles/15715302033549-Level-Validation-in-Java-Lab) · product documentation | Run/show output versus test/pass distinct | Side-by-side edited source, preview, explicit validation | Never equate build/test success with content approval |
| [Google Arts & Culture](https://artsandculture.google.com/project/art-camera?hl=en-GB) · live product catalogue | Guided zoom/focus before exploring depth | Expand from a selected node to connections and context | Avoid visual scale/animation as the only means of navigation |
| [Observable](https://observablehq.github.io/documentation/inputs/overview) · documentation | Controls and data displays connected in the same view | Filter a relationship view without recreating source data | Readable alternatives and source/refresh labels |
| [The Pudding](https://pudding.cool/) · published visual essays | A narrative gives a graph purpose | Introduce one visual question; reveal comparison then interpretation | No gratuitous scrollytelling or animation |
| [Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/) · usability guidance | Show essential actions first | Hide advanced controls in a deliberate secondary layer | Do not hide material qualifications or mandatory information |
| [W3C WAI](https://www.w3.org/WAI/tutorials/) / [APG tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) · standards guidance | Semantic, keyboard-operable interaction | Keyboard tab/panel control and understandable feedback | Automated scans cannot replace manual testing |
| [The A11y Project](https://www.a11yproject.com/checklist/) · practical checklist | Structured pre-release checklist | Add to test protocol | Not exhaustive and not a compliance certificate |
| [web.dev Web Vitals](https://web.dev/articles/vitals) · performance guidance | Measure speed, interactivity, stability | PageSpeed/Lighthouse pilot with field-data caveats | Not a direct measure of learning |

**Pattern decision log (SHOULD):** `reader problem → concrete proposed example → owner accept/adjust/reject → implemented component → checked result`. Reader studies may be added later, but they are not a current gate. Reject interactions that merely increase decoration, content length, setup effort, or visual motion.

## 11. What to hand to an implementation agent

Provide the approved specification, current content and source inventory, desired change IDs, examples and test data, explicit exclusions, acceptance tests, and relevant tooling constraints. Ask the agent to *inspect before editing*, implement the smallest coherent vertical slice, run appropriate tests, and report verified versus unverified outcomes. Never direct it to invent screenshots, user-study findings, or a successful deployment.

**Exit condition for specification approval:** The reader promise, audience, groups, chapter outcomes, interactive policy, visual/UX principles, source architecture, and release criteria are agreed. Detailed component choices can be deferred until implementation.
