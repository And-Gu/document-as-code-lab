---
id: explorable-presentations
chapter_number: 13
bonus: true
status: in-review
audience: general-professional
learning_goal: "Design presentations as source-linked, reusable experiences and choose between guided stories, interactive maps, dashboards and explanations for a particular audience."
visuals: []
---

# Beyond Slides: Presentations as Explorable Knowledge

A project leader is preparing a review. The team has written a detailed report, collected data, and made a system diagram. The conventional response is to copy a selection of that material into slides. During the meeting, someone asks a question the deck did not anticipate, and the presenter begins searching through documents.

What if the presentation were not a second copy of the information? What if it were a **guided way into maintained knowledge**, with the option to explore when a new question arises?

This chapter asks how we can use a browser, reusable visual components, and document-as-code practices to make presentations more useful than a sequence of static slides. You do not need to be a developer to follow the approach or try the examples.

> **Bonus chapter — optional deep dive.** The main learning journey consists of twelve chapters. This additional resource is for anyone designing a briefing, workshop, course or interactive knowledge experience. It goes further into available tools, practical authoring choices, references and evaluation methods. You can follow the principles whether you work in GitHub and Astro, Office, or another information environment.


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

## The presentation-as-code toolbox

Technology should serve the audience's question. The following directory distinguishes tools that help you **guide a talk**, **explore concepts**, **investigate data**, or **produce animated material**. These are options to evaluate, not a shopping list or a requirement to rebuild the current website.

### Presentation engines and narratives

| Tool | Typical output | When it helps | Fit with this Lab |
| --- | --- | --- | --- |
| [Astro](https://astro.build/) with [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/) and selective React | Narrative website with interactive islands | Source-linked reading, storytelling and embedded demos | **Preferred base**; Astro is already used |
| [Reveal.js](https://revealjs.com/) | Presenter-controlled HTML slides | Timed talks with keyboard navigation, overview and notes | **Already implemented**, with four validated YAML slide types |
| [Slidev](https://sli.dev/) | Markdown + Vue component slides | Developer-oriented demos, code walkthroughs and rapid editing | Good alternative; would introduce Vue |
| [Marp](https://marp.app/) | Markdown slides, HTML, PDF or PPTX | Fast, portable slide production with VS Code | Good alternative when interaction is limited |
| [Spectacle](https://formidable.com/open-source/spectacle/) | React-based presentation deck | Presentations that are mostly composed of custom React scenes | More control; adds a second deck application |
| [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Scroll-triggered narrative animation | Reveal, continuity, movement and causal sequence | Add only when movement improves comprehension |

For a management briefing with strict time, begin with the working Reveal.js system. For a reader who should scroll through a changing diagram and revisit details later, an Astro article with reusable components may be a better home.

### Mind maps, whiteboards and connected ideas

| Tool | What it does | Choose it for | Important limitation |
| --- | --- | --- | --- |
| [Markmap](https://markmap.js.org/docs/introduction) | Turns Markdown headings and lists into foldable, zoomable branches | A navigable agenda, idea hierarchy or subject overview | A hierarchy is not a typed knowledge graph |
| [Mermaid](https://mermaid.js.org/) | Generates diagrams from editable text | Structured processes, decisions, sequences and simple state diagrams | Complex drill-down needs extra code |
| [React Flow](https://reactflow.dev/examples) | Interactive node-and-edge canvases | Source-linked relationships and selectable architecture objects | Relationships must be modeled, not guessed |
| [tldraw](https://tldraw.dev/) | Infinite canvas and whiteboard components | Group exploration, workshops and annotated system sketches | Persistence, ownership and collaboration need design |
| [Excalidraw](https://excalidraw.com/) | Hand-drawn-style collaborative diagrams | Fast workshop sketches or expressive illustrations | An exported sketch is not itself maintained semantic data |
| [D3](https://d3js.org/) | Low-level data-driven visualization library | Custom interactive layouts beyond common chart patterns | Higher code and testing cost |

Use Markmap when navigation follows headings. Use React Flow when selecting an object must reveal its ID, typed links, source record and state. The second needs a controlled information model, not just a more attractive layout.

### Data visualization, dashboards and simulations

| Tool | Best application | Decision consideration |
| --- | --- | --- |
| [Observable Plot](https://observablehq.github.io/plot/) | Concise, source-driven charts and comparisons | Strong candidate when a small chart plus a data table answers the question |
| [Observable Framework](https://observablehq.github.io/framework/) | Reports and analytical dashboards | Excellent separate publishing environment; not required for an Astro site |
| [Vega-Lite](https://vega.github.io/vega-lite/docs/) | Declarative, reviewable interactive chart specifications | Versioned JSON is useful for reproducible views |
| [Apache ECharts](https://echarts.apache.org/en/index.html) | Dashboards with established chart families and controls | Feature-rich but not a substitute for clear units and data provenance |
| [Three.js](https://threejs.org/) / [React Three Fiber](https://r3f.docs.pmnd.rs/) | Interactive spatial models and 3D scenes | Use only if depth, orientation or geometry contributes to understanding |

A dashboard can reveal trends and outliers, but only if its audience knows which data are current, what filters apply and what conclusions are legitimate. A three-dimensional simulation should state the model assumptions; visual realism is not evidence that the model is correct. The companion [Executable Engineering Lab](https://and-gu.github.io/executable-engineering-lab/) develops those technical contracts.

### Animation, video and verification

| Tool | Role | When it earns its complexity |
| --- | --- | --- |
| [Remotion](https://www.remotion.dev/) | Programmatically render video with React | Reusing a visual explanation as recorded training or social content |
| [Manim](https://www.manim.community/) | Python-defined mathematical animation | A carefully authored explanation of transformations and mathematics |
| [Playwright](https://playwright.dev/) | Browser and interaction tests | Verify projector-scale navigation, reset, source links and responsive views |
| [Pandoc](https://pandoc.org/) | Convert and assemble document formats | Provide conventional handouts or compatible exports |
| Browser print/PDF | Static, portable fallback | Useful when a visitor has no browser interaction or network access |

Video is a complementary output, not an interactive replacement. A short recording can capture the guided explanation; the underlying data and source links should remain discoverable in the web version.

### My recommended starting set

For this repository, explore **Astro + Reveal.js + Markmap + React Flow + Observable Plot** in that order. Keep existing validated components and dependencies where possible. Introduce GSAP for a real teaching animation or Three.js for a genuine spatial question, never as default decoration.

The key decision rule is: *What new question can someone answer with this interaction that a clear static page would leave unanswered?*

## Worked example: one knowledge source, three experiences

Consider the proposed contract amendment in [Chapter 9](09-images.md). The audience should understand why DEL-101 needs review and why DEL-102 is an additional *review candidate*, not an automatically confirmed impact.

| Mode | Opening | Meaningful interaction | End result |
| --- | --- | --- | --- |
| **Present** | One statement about the proposal and its current status | Reveal the direct and indirect relationships in a controlled sequence | Short decision-oriented talk |
| **Explore** | A relationship map showing affected projects and deliveries | Select AMD-001, trace typed links, filter and reset | A source-linked view for audience questions |
| **Read** | Narrative with supporting data and references | Follow stable links to detailed records and definitions | A durable reference or handout |

The same maintained records can supply all three modes, but the *narrative choice* and *delivery behavior* differ. It is not enough to embed a dashboard in a slide and call it a presentation.

## A practical authoring and agent workflow

Begin with a small **scene contract**. For example:

| Contract field | Illustrative scene definition |
| --- | --- |
| Claim | "AMD-001 directly references DEL-101" |
| Source | The maintained proposed-amendment record and typed link |
| Visual | Highlight the precise recorded relationship |
| Reveal order | Proposal → direct delivery → dependent review candidate |
| Interaction | Open the selected record, navigate and return |
| Fallback | A text description and tabular link list |
| Review | Verify status, IDs and relationship meanings |

This is an **illustrative authoring brief**, not an accepted YAML type in the current slide schema. The real [presentation guide](../presentations/README.md) lists the available types and fields. A future React/interactive scene type would require a schema, renderer, tests and static fallback.

Use the following sequence for either an individual author or an AI-assisted team:

1. **Define the audience and decision.** Why are people here, and what should change in their understanding?
2. **Identify maintained sources.** Choose evidence, claims, definitions and source revisions; flag unresolved uncertainty.
3. **Storyboard the argument.** Outline an opening, three to five meaningful turns, a conclusion and a link to explore further.
4. **Select the simplest visual per scene.** Choose a static diagram unless a specific interaction adds understanding.
5. **Keep knowledge and presentation separate.** Scene definitions select meaning, pacing and view; they do not rewrite engineering calculations or source records.
6. **Test the real presentation route.** Keyboard, contrast, projector distance, network loss, reduced motion and browser resize.
7. **Publish with provenance.** Provide sources, speaker notes and any snapshot dates or assumptions.
8. **Observe understanding.** Ask someone to explain the point back to you; revise weak scenes before adding animation.

An agent can help propose scenes, generate a layout, draft narration and run visual regression tests. It must also report unsupported claims, invalid links and invented connections. A working animation is not proof of a correct explanation.

## Try three formats with the existing Lab

**Experiment A — Guided story.** Open the [information model deck](https://and-gu.github.io/document-as-code-lab/presentations/information-model/). Pick a slide that currently lists facts. Rewrite it as a single claim with an appropriate reveal order; note what supporting material should be accessible only on request.

**Experiment B — Explorable map.** Open the [Contract Explorer](https://and-gu.github.io/document-as-code-lab/chapters/09-images/#contract-explorer-widget). Begin with a proposed amendment and trace one recorded connection and one possible review candidate. Write a presenter script that can open either record without losing the overarching question.

**Experiment C — Data story.** Open the [Project Control Center](https://and-gu.github.io/document-as-code-lab/dashboard/). Explain one graph to someone unfamiliar with the project. Which filter would improve the story? Where must you clarify snapshot age, measurement method or limits?

Compare the formats for **clarity, effort, shareability and the ability to answer an unexpected audience question**, not for the number of animations.

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
