---
id: 05-images
chapter_number: 9
status: in-review
learning_goal: "Explain how one maintained information model can answer different questions through interactive views, while preserving source identity and meaning."
visuals: []
---

# Information You Can Explore

A contract manager receives a proposed amendment. Which deliveries deserve review before the team accepts it? The answer depends on connections between agreements, projects, and deliveries, not just the wording of one document.

The onboarding examples showed how to identify, connect, and process information. Here we use a different fictional setting to explore what happens when **readers choose the question and follow the relationships themselves**.

## A customer, two projects, several commitments

Our customer has two projects. A framework agreement covers both, while a delivery order covers one. Proposed amendment AMD-001 would change terms for its interface package, DEL-101. The acceptance workshop, DEL-102, depends on that package.

These are **fictional teaching records**, maintained as [Markdown sources in the repository](../examples/contract-explorer/README.md), not actual contracts. Their relationships are recorded explicitly rather than guessed from titles.

## Same information, different questions

Consider three questions from three different people.

**Account manager: Which projects share an agreement?**

Show the customer, its projects, and the agreements linked to each one. The shared framework agreement becomes visible without opening every contract.

**Delivery manager: What depends on the interface package?**

Switch to a delivery-focused view. DEL-102 depends on DEL-101. A list of documents would be less useful than seeing that relationship directly.

**Contract manager: What should we review if the amendment is accepted?**

Follow AMD-001's connections to the affected delivery, its project, and dependent work. The links identify possible review work; the proposal is not yet effective.

The underlying records have not changed. **Only the question and the view have changed.**

## Explore: One source, three views

The website's Contract Explorer reads the same nine records for all three views. It is a fictional example, updated when the site is built. In GitHub's Markdown preview, use the record table and linked sources to follow the same relationships.

The explorer offers three selectable perspectives:

| View | Reader can do | What it reveals |
| --- | --- | --- |
| **Relationships** | Select a customer, project, agreement, or delivery | Connected records, with labeled links |
| **Commitments** | Filter deliveries by project or agreement | Delivery names, planned dates if recorded, and associated terms |
| **Change impact** | Select an agreement or proposed amendment | Direct links and possible downstream review candidates |

Selecting a record reveals its **source file, status, revision, and explicit relationships**. The interface distinguishes *recorded connections* from *possible impacts inferred by following those connections*.

AMD-001 remains **proposed**, not effective. Its lifecycle status does not establish whether a delivery is complete; the explorer shows delivery execution status separately.

The explorer is not a new system of record. Selection and filtering change the view, not the maintained files. Source edits appear after the site is rebuilt.

**If proposed amendment AMD-001 were accepted, which deliveries deserve review?** Start with **Explore change impact** below, then inspect the directly linked delivery and follow the dependency to a further review candidate. Without JavaScript, read the Change impact list and linked records; the same recorded paths remain available.

<!-- interactive: contract-explorer -->

The direct links identify DEL-101. Because DEL-102 depends on it, DEL-102 is a further review candidate. Neither connection decides what the team should change. You can inspect the same chain in the sources below.

## Inspect the example records

| Record | What it represents | Connection |
| --- | --- | --- |
| CUST-01 | Northstar Logistics | Customer for both projects |
| PRJ-101 | Depot rollout | Includes DEL-101 and DEL-102 |
| PRJ-102 | Training services | Includes DEL-103 |
| AGR-001 | Framework agreement | Applies to both projects |
| AGR-002 | Project delivery order | Applies to PRJ-101 |
| AMD-001 | Proposed amendment | Proposes changes to AGR-002 affecting DEL-101 |
| DEL-101 | Interface package | Part of PRJ-101 |
| DEL-102 | Acceptance workshop | Part of PRJ-101; depends on DEL-101 |
| DEL-103 | Training package | Part of PRJ-102 |

## Why this is more than a dashboard

A dashboard usually answers a set of predefined questions. An exploratory interface allows readers to select an object, follow a relationship, and ask the next question.

That is where structured information becomes especially useful. A record has an identity; its relationships have meanings; its status belongs to a defined process. Those details let people navigate the information rather than only read a published snapshot.

The same approach can support a knowledge graph, portfolio overview, dependency view, or AI-assisted query interface. Each is an application of maintained information—not a reason to maintain separate copies of it.

## Keep the connection to the sources

An attractive visualization can still mislead. A line between two objects must mean something specific. A date needs a source. A missing link means *no recorded link*, not proof that the objects are unrelated.

When a source changes, generated views should refresh through a defined process. Users should be able to inspect which source and revision produced the view. If a proposed change may affect other items, treat them as review candidates, not automatically approved updates.

> **Explore further:** Want to create reusable diagrams and views? The [visual-source guide](../reference/visual-sources.md) explains Mermaid, SVG, raster images, source provenance, and accessible alternatives. Reading needs no setup; optional rendering examples identify their tools.

A useful explorer lets you move from a question to recorded evidence without maintaining another copy of the information. Those views still need to be rebuilt when sources change. [Chapter 10](10-publishing.md) follows how this tutorial automates that work.

<!-- interactive: chapter-quiz -->
