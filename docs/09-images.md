---
id: 05-images
chapter_number: 9
status: approved
learning_goal: "Use a knowledge graph to find an explanation, understand how its records and relationships support exploration, and see how an AI agent can follow the same sources."
visuals: []
---

# Information You Can Explore

A colleague asks you how the onboarding lab decides which procedures belong in the review queue. You explored that queue in [Chapter 7](07-processing.md), where it listed draft procedures awaiting review. How can you bring together what you have learned to explain how it works?

The graph below gives you an overview of the concepts introduced throughout the course and shows how they connect. This is a **knowledge graph**: a map of ideas linked by named relationships. Select a concept to see its description, related ideas and links to the chapters that explain it.

<span id="explore-one-source-three-views"></span>
<span id="explore-how-does-metadata-help-us-reuse-information"></span>

## Explore: From a review status to a review queue

Use the graph to see how the ideas you have learned fit together. To answer your colleague’s question, start in the details panel on the right of the graph. On smaller screens, the panel appears below it.

1. **Metadata** is already selected. Review status is one example of metadata: it describes whether a procedure is a draft or approved.
2. In the panel’s **How it connects** list, select **Processing** from **Processing uses Metadata**. The panel now shows information about processing.
3. Open the Chapter 7 link under **Read more**. That chapter shows how the processor reads each procedure’s status and selects drafts for the review queue.

You can also select labels in the graph or use **Find a concept** to search for a term.

<!-- interactive: knowledge-map -->

## Follow a question through the graph

The **Processing** panel also shows what processing can produce. Select **Derived view** from the connection **Processing produces Derived view**. A derived view presents information selected, combined or calculated from maintained sources. In the onboarding lab, the review queue is a derived view: it lists the draft procedures selected by the processor.

<figure class="example-flow">
  <figcaption>How a review status helps produce the queue</figcaption>
  <ol role="list">
    <li><strong>Metadata</strong><span>The procedure’s status field records whether it is a draft or approved.</span></li>
    <li><strong>Processing</strong><span>The processor reads that field and selects procedures marked as drafts.</span></li>
    <li><strong>Derived view</strong><span>The review queue lists those procedures so their owners can see what needs review.</span></li>
  </ol>
</figure>

We can now answer the colleague:

> The status field gives the processor a way to select drafts. The review queue presents the selected procedures together. When a procedure’s status changes, the next build uses the new value to decide whether to include it.

The graph helped us locate and connect the ideas; the linked chapter supplied the worked example. That is what exploration adds: a way to start with a question and find the information needed to answer it.

<span id="from-metadata-to-a-useful-view"></span>

## What makes the map work?

The map begins with a small record for each concept. Consider **Metadata**:

| Part of the record | What it contains | What it lets us do |
| --- | --- | --- |
| Identifier | `metadata` | Refer to this concept consistently |
| Label and description | “Metadata” and an explanation of the term | Find and understand the idea |
| Course section | Make information processable | Group and filter related course topics |
| Reading reference | Chapter 5’s explanation of metadata | Open the relevant passage |

These are the **structured fields** introduced in [Chapter 5](05-structured-content.md). The website uses them to label the graph, populate the information panel and build reading links.

A connection has its own recorded meaning. **Processing uses Metadata** joins two concept IDs with the relationship “uses”. This applies the **named relationships** from [Chapter 6](06-information-architecture.md). The line tells us how the concepts relate; their positions help us arrange and explore the map.

Finally, the **processing** introduced in Chapter 7 prepares the view. During the site build, the website checks the concept IDs and references, then uses the records to create the graph and the written concept list. The same maintained information supports both.

<span id="keep-the-connection-to-the-sources"></span>

You can inspect the [concept records and relationships](../data/course-concepts.json) in the repository. The authors maintain these connections alongside the chapters. If an explanation moves or a term changes, the records and chapter edits can be reviewed together before the next build updates the map.

<span id="same-information-different-questions"></span>

## Choose where to look

Suppose the colleague now asks what helps an AI agent find the right source. Search for **AI agent**, follow its connection to **Retrieval**, and then select **Metadata**. Retrieval means finding relevant information for a task. Fields such as a topic or review status can help select useful sources; the sources’ text provides the detail.

The controls help you concentrate on the part of the course you need:

- **Course section** narrows the map to one group of topics. Choose **Make information processable** to concentrate on fields, relationships and processing, or **All four sections** to follow connections across the course.
- **Focus on these connections** brings the selected concept and its neighbours closer, making that part of the map easier to read.
- **2D** gives you a flat view; **3D** lets you turn the map. **Reset view** returns to the starting view with Metadata selected.

<span id="why-this-is-more-than-a-dashboard"></span>

These choices change how you look at the information. The concept records stay the same. The graph itself is another **derived view**, just as the review queue is. The concept list below the graph offers the same connections and reading links as text.

<span id="ask-an-ai-agent-to-prepare-the-review"></span>

## Let an AI agent follow the same sources

In [Chapter 8](08-ai-native.md#give-the-agent-context-it-can-use), we gave an agent context it could use. The graph adds a guide to that context: named ideas, connections between them and references to the explanations.

An agent with access to the concept records and linked chapters can investigate the colleague’s original question too. A request could be:

> Explain how the onboarding lab uses a procedure’s review status to build the review queue. Follow the course graph to the relevant chapters, use the example in Chapter 7 and link to the passages that support the answer.

The agent can follow **Metadata → Processing → Derived view**, read the relevant sections and prepare an explanation with source links. A reader can then inspect the same passages and check whether the explanation fits the example.

The benefit also extends to maintenance. If the team changes how the queue selects procedures, an agent can use the references to find related explanations and propose edits together. The recorded connections give it useful starting points, while the source text explains what each connection means.

## Use the same idea in your work

A support team could connect products, recurring problems, troubleshooting procedures and training material. A colleague investigating a login problem could find the relevant product, follow a link to its troubleshooting procedure and open the instructions. An agent with access to those sources could follow the same route to prepare a response.

The information model makes that possible: identifiable records, fields with agreed meanings and useful relationships. A graph makes those connections visible. Search, a filtered list or an agent’s explanation can provide other ways into the same information.

<span id="a-customer-two-projects-several-commitments"></span>
<span id="inspect-the-example-records"></span>
<span id="contract-explorer-widget"></span>

For another application, the [Contract Explorer](/document-as-code-lab/labs/contract-explorer/) lets you follow links between agreements, orders, projects and deliveries. The [visual-source guide](../reference/visual-sources.md) explores other ways to show connected information.

Finding a source is the beginning of an investigation. We may also need to check its values, explain a gap or calculate something new. [Chapter 10](10-data-enrichment.md) follows a service manager through that work, turning case records into a finding that can be checked and reused.

<!-- interactive: chapter-quiz -->
