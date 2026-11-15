---
id: explorable-presentations
chapter_number: 13
status: draft
audience: general-professional
learning_goal: "Design presentations as source-linked, reusable experiences and choose between guided stories, interactive maps, dashboards and explanations for a particular audience."
visuals: []
---

# Beyond Slides: Presentations as Explorable Knowledge

A project leader is preparing a review. The team has written a detailed report, collected data, and made a system diagram. The conventional response is to copy a selection of that material into slides. During the meeting, someone asks a question the deck did not anticipate, and the presenter begins searching through documents.

What if the presentation were not a second copy of the information? What if it were a **guided way into maintained knowledge**, with the option to explore when a new question arises?

This chapter asks how we can use a browser, reusable visual components, and document-as-code practices to make presentations more useful than a sequence of static slides. You do not need to be a developer to follow the approach or try the examples.

## A presentation is a view, not a source of truth

A report, presentation, dashboard, and learning article can describe the same subject without being identical. Each selects and arranges information to help a particular audience do something.

That is the distinction introduced in [Information You Can Explore](09-images.md): the underlying records remain the same while the reader's question changes. For presentations there is an additional responsibility: **someone designs a narrative**. A presenter decides what the audience should see first, why the next step matters, and where exploration is appropriate.

A presentation built from maintained sources therefore has at least four layers:

| Layer | The question it answers | Example |
| --- | --- | --- |
| **Knowledge** | What do we actually know? | Approved records, data, definitions and references |
| **Narrative** | What should this audience understand or decide? | A review story with a clear beginning and decision |
| **Experience** | What should people see or be able to change? | Diagram, chart, map, simulation or comparison |
| **Delivery** | How will the experience be used? | Live talk, self-guided web page, workshop or reference handout |

Keep the layers connected, but do not collapse them into one file. A rewritten slide headline is a narrative change. A corrected source date is a knowledge change. Both need review, for different reasons.

## Choose the experience before choosing the tool

A browser supports more than slide navigation. These six formats solve different communication problems.

| Format | What the audience does | Useful when |
| --- | --- | --- |
| **Guided HTML deck** | Follows a sequenced talk, with optional branches | Timing and presenter control matter |
| **Visual story or scrollytelling** | Reads while visuals reveal and explain concepts | A process or transformation is the main argument |
| **Navigable mind map** | Expands a topic and follows branches | The goal is orientation, synthesis or discussion |
| **Interactive dashboard** | Filters data and compares alternatives | Decisions depend on quantities or changing evidence |
| **Connected system map** | Selects objects and follows meaningful links | Relationships and dependencies are central |
| **Explorable explanation** | Changes an assumption and observes a result | Cause, effect, behavior or uncertainty must be understood |

A mind map is not automatically a presentation. A dashboard is not automatically an argument. A live simulation is not automatically an explanation. Each needs a communication purpose, appropriate context and a way back to its source.

The options can be combined. A presenter could begin with three guided scenes, open a system map for questions, and return to a concise decision view. A self-guided reader could follow the same sequence without the presenter.

## Design for three ways of using the same material

The most useful distinction may not be between PowerPoint and HTML. It may be between **presenting**, **exploring**, and **reading**.

**Present:** The presenter controls pacing. Show one conclusion at a time, preserve a clear progression and make it possible to jump to a relevant detail and return. Keep text readable from the back of the room.

**Explore:** The visitor controls the path. Provide an overview, selectable objects, meaningful filters, reset controls and explanations for what a selection means.

**Read:** The visitor needs a persistent reference afterward. Provide full context, sources, alternative tables, accessible descriptions and stable links. This view does not need presenter timing.

These are *delivery modes*, not necessarily three different documents. A selected passage, graph or dataset may be shared while the interaction and layout change. Different modes still require design and review; they should not be assumed to emerge automatically from the same Markdown.

## Build a story around questions

Consider our fictional contract amendment from [Chapter 9](09-images.md). A delivery manager has ten minutes to explain the impact of proposed amendment AMD-001.

A conventional deck might list the agreement, two projects, three deliveries, and a large screenshot of a relationship diagram. An explorable presentation would instead follow the audience's questions:

1. **What has changed?** Show the proposed amendment and its stated status. Avoid presenting a proposal as an approved change.
2. **What connects to it?** Reveal the directly related agreement, project and delivery.
3. **What might be affected next?** Follow the recorded dependency from DEL-101 to DEL-102. Label the second connection as a *review candidate*, not a verified impact.
4. **What do we need to decide?** Show the outstanding review questions, source links and responsible decision.
5. **What if someone asks about the other project?** Open the relationship map and navigate there without inventing a new slide.

The existing [Contract Explorer](https://and-gu.github.io/document-as-code-lab/chapters/09-images/) demonstrates the source-linked exploration. Turning it into a presenter-led narrative would be **future work**; the explorer itself is not an existing presentation deck.

This example is deliberately about information and communication. Detailed engineering models and physically meaningful simulations belong in the companion [Executable Engineering Lab](https://and-gu.github.io/executable-engineering-lab/).

## The four-part contract for each scene

A reusable presentation scene should have more than a title and a set of bullets.

| Element | Authoring question | Review check |
| --- | --- | --- |
| **Claim** | What should the audience understand? | Supported by the selected sources? |
| **Visual** | What helps make the claim intelligible? | Accurate, legible and appropriately simplified? |
| **Interaction** | What might the audience ask or change? | Clear purpose, feedback, reset and constraints? |
| **Evidence** | Where can the audience inspect the basis? | Stable references, revision and assumptions? |

One scene might use a static image because interaction would add nothing. Another might have a selectable graph; a third might include a temporary what-if calculation. Do not make everything interactive merely because the browser permits it.

A useful editing practice is to write the claim in one sentence *before* designing the visual. Remove any animation that cannot explain what changed or why it matters.

## Progressive disclosure is better than decorative motion

Start with the big picture. Reveal complexity when the audience needs it. Keep the important objects in familiar positions while adding information, so the viewer can follow change without repeatedly relearning the layout.

Animation can clarify order, movement, accumulation or causality. It can also conceal a weak explanation. Scrolling is valuable when the reader moves through a connected argument; it is less useful when it simply triggers unrelated transitions.

The same applies to 3D. Use it when depth, geometry, orientation, occlusion or spatial relationships matter. A static two-dimensional diagram is often clearer for a simple relationship or decision.

For inspiration, [Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/) explains the educational affordances and authoring challenges of interactive reading. [Bartosz Ciechanowski's Airfoil](https://ciechanow.ski/airfoil/) is an example of explanations that introduce manipulable visuals exactly when they become useful. [The Pudding](https://pudding.cool/) shows a different, editorial approach to data-driven storytelling. [The Evolution of Trust](https://ncase.me/trust/) shows how a narrative can unfold through small interactive games.

## How presentation-as-code fits this lab

The Lab already builds HTML slide decks. Definitions live in [presentations/](../presentations/README.md), select messages and chapter sources, and are rendered with Astro and Reveal.js. There are speaker-note reading pages and a shared publishing workflow. The underlying knowledge remains in the chapter and reference sources.

**This implementation is a starting point, not yet a general interactive presentation environment.** Its presentation schema currently permits four slide types: title, content, comparison and step diagram. It does not provide reusable interactive dashboards, arbitrary React components or a shared presentation/exploration mode. Those are proposed directions, not finished features.

The natural extension is to keep the current working decks and add **explicitly typed experience components** rather than copy web applications into slide YAML:

| Component family | Maintained input | Possible experience |
| --- | --- | --- |
| Narrative scene | Claims, citations, notes and step order | Presenter-led HTML |
| Concept map | Markdown hierarchy or typed topic records | Fold, zoom and navigate |
| Data view | Validated dataset, definitions and filters | Chart, dashboard and detail table |
| Relationship explorer | Objects with IDs and typed links | Select, filter and follow connections |
| Demonstration | Versioned model, bounded inputs and outputs | Predict, change, observe and reset |

Components should consume the authoritative source or an explicitly generated snapshot. The presentation definition selects the scene and its editorial framing. It should not create another unreviewed dataset or another model formula.

A practical future architecture is:

**Maintained sources → validated data and narrative selection → reusable visuals → Present / Explore / Read views → reviewed publication.**

This is a design proposal, not a claim that all modes are already implemented.

## A practical tool palette

Choose tools by the communication need and the architecture already in use. Introducing a second development stack should be justified by a tangible benefit.

| Need | Tool to investigate | Reason to consider it |
| --- | --- | --- |
| Source-linked pages with selective interactivity | [Astro](https://astro.build/) with React and, when useful, MDX | Retains the Lab's existing static build and reusable browser components |
| Presenter navigation, notes and full-screen display | [Reveal.js](https://revealjs.com/) | Already used by this Lab; the newer [React bindings](https://revealjs.com/react/) are an optional future path |
| Mind maps from Markdown | [Markmap](https://markmap.js.org/docs/introduction) | Converts headings and lists into a foldable, zoomable map |
| Editable or inspectable relationship views | [React Flow](https://reactflow.dev/examples) | Suitable for controlled node-and-edge experiences |
| Data-rich reports and coordinated visualizations | [Observable Framework](https://observablehq.github.io/framework/what-is-framework) | Strong reference for data applications; a separate framework, not an Astro dependency |
| Scroll-linked narrative movement | [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Useful when the timing of an explanation has a clear purpose |
| Reusing React explanations as video | [Remotion](https://www.remotion.dev/) | A potential route from reusable scenes to rendered video |

[Slidev](https://sli.dev/) is another strong Markdown-first slide option, but its Vue-oriented component model is less aligned with the Lab's existing React/Astro choices. It is an alternative, not a recommended migration.

Separate **how to communicate** from **how to build a physically meaningful technical visualization**. The latter needs model contracts, numerical assumptions, validation and testing; see the companion engineering tutorial for that deeper subject.

## Keep the presentation connected to its evidence

Source links alone are not enough. A chart needs the dataset, definitions, selection criteria and effective revision. An animation based on a simplified model needs its limits. A dashboard using an hourly published snapshot must not imply second-by-second live data.

Use a small provenance checklist for every scene:

- Can the viewer identify where the information came from and whether it is fictional, historical, live, proposed or approved?
- Is a browser interaction merely filtering a view, calculating a temporary scenario, or actually saving a change?
- Can someone reproduce or review the result from recorded inputs and rules?
- Is a screenshot or exported video labeled with its version and relevant date?

**Presentation review is not source approval.** Changes to a claim, selection, caption, transition or visual emphasis can alter meaning even if the data have not changed.

## Quality matters on the day of the presentation

A visually impressive demonstration that fails in a meeting is not a good presentation. Design for the real environment:

- **Readable:** Test text, scale and contrast on a projector, not only a large desktop monitor.
- **Navigable:** Use keyboard navigation; offer a reliable way to return after opening an exploration branch.
- **Accessible:** Provide semantic controls, text equivalents, data tables and reduced-motion behavior.
- **Reliable:** Provide a deterministic fallback or recorded demo when a live service, API, network connection or heavy 3D renderer is unavailable.
- **Reproducible:** Keep dependencies, content revisions, source data and rendering choices under review.
- **Shareable:** Publish stable links to the relevant scene and supporting sources.

An online interactive dashboard may require a connection. Offline presentation should be treated as a separate acceptance check, not assumed because the site is statically hosted.

## Try it: Reframe one of the existing decks

Open the [Lab's presentation collection](https://and-gu.github.io/document-as-code-lab/presentations/) and choose an existing deck. You can also read its [YAML authoring guide](../presentations/README.md) without installing anything.

Pick one scene and answer:

1. What is its essential claim? Could someone summarize it in one sentence?
2. What should be shown immediately, and what could be revealed only after a question?
3. Would a static visual, linked record, explorable map or small interactive comparison improve understanding?
4. What must remain visible if JavaScript, external data or animation is unavailable?
5. Where should a viewer go afterward to investigate the underlying information?

A useful experiment is to prototype three alternative views of the *same* source material: a ten-minute guided narrative, a navigable map, and an explanation the audience can manipulate. Compare clarity, effort, maintainability and actual reader feedback rather than animation count.

## Watch and explore further

- [Bret Victor — Inventing on Principle](https://vimeo.com/906418692) demonstrates the importance of seeing the consequences of changes immediately.
- [Nicky Case — How to Explain Things Real Good](https://www.youtube.com/watch?v=b-M2U3Jl1Cg) offers concrete storytelling advice: show before telling, connect ideas through cause and consequence, and test drafts with readers.
- [Hans Rosling — 200 Countries, 200 Years, 4 Minutes](https://www.youtube.com/watch?v=jbkSRLYSojo) demonstrates how pacing and animated data can serve a compelling explanation.
- [Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/) provides a research-informed vocabulary for why interaction can help people understand.

The goal is not to eliminate slides. It is to avoid treating slides as the only form a presentation can take.

**A presentation should be a deliberate way of experiencing knowledge, not a disconnected copy of it.**
