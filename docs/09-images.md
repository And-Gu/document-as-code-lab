---
id: 05-images
chapter_number: 9
status: in-review
learning_goal: "Explain how one maintained information model can answer different questions through interactive views, while preserving source identity and meaning."
visuals: []
---

# Information You Can Explore

A document answers the questions its author anticipated. Maintained, structured information can support other questions without requiring someone to write a new document for each one.

So far, we have identified information objects and their relationships ([chapter 6](06-information-architecture.md)), then used processing to produce outputs ([chapter 7](07-processing.md)). Now we take the next step: **let people explore those relationships and choose the view they need.**

## A customer, two projects, several commitments

Imagine a company delivering multiple projects to the same customer. Each project has its own deliveries and schedule, but some contracts cover more than one project. Amendments may change the terms for particular deliveries.

Our fictional example contains:

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

These are **fictional teaching records**, maintained as [Markdown sources in the repository](../examples/contract-explorer/README.md), not actual contracts. Their relationships are explicitly recorded; an application must not invent them by guessing from titles.

## Same information, different questions

Consider three questions from three different people.

**Account manager: Which projects share an agreement?**

Show the customer, its projects, and the agreements linked to each one. The shared framework agreement becomes visible without opening every contract.

**Delivery manager: What depends on the interface package?**

Switch to a delivery-focused view. DEL-102 depends on DEL-101. A list of documents would be less useful than seeing that relationship directly.

**Contract manager: What should we review if the amendment is accepted?**

Select AMD-001 and follow its recorded connections. DEL-101 is directly affected; PRJ-101 and dependent DEL-102 are *candidates for review*. The connections do not prove that every item needs a change, or that the proposed amendment is already effective.

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

For example, if AMD-001 is **proposed**, the view must not quietly present it as a signed amendment. Likewise, an agreement's approval state does not establish whether a delivery is complete. **Document status and delivery status are different information.**

The explorer is not a new system of record. Selection and filtering change the view, not the maintained files. Source edits appear after the site is rebuilt.

**If proposed amendment AMD-001 were accepted, which deliveries deserve review?** Start with **Explore change impact** below, then inspect the directly linked delivery and follow the dependency to a further review candidate. Without JavaScript, read the Change impact list and linked records; the same recorded paths remain available.

<!-- interactive: contract-explorer -->

## Why this is more than a dashboard

A dashboard usually answers a set of predefined questions. An exploratory interface allows readers to select an object, follow a relationship, and ask the next question.

That is where structured information becomes especially useful. A record has an identity; its relationships have meanings; its status belongs to a defined process. Those details let people navigate the information rather than only read a published snapshot.

The same approach can support a knowledge graph, portfolio overview, dependency view, or AI-assisted query interface. Each is an application of maintained information—not a reason to maintain separate copies of it.

## Keep the connection to the sources

An attractive visualization can still mislead. A line between two objects must mean something specific. A date needs a source. A missing link means *no recorded link*, not proof that the objects are unrelated.

When a source changes, generated views should refresh through a defined process. Users should be able to inspect which source and revision produced the view. If a proposed change may affect other items, treat them as review candidates, not automatically approved updates.

> **Explore further:** Want to create reusable diagrams and views? The [visual-source guide](../reference/visual-sources.md) explains Mermaid, SVG, raster images, source provenance, and accessible alternatives. Reading needs no setup; optional rendering examples identify their tools.

**Key point:** Document-as-Code becomes more powerful when information is not only published, but also **available to explore, connect, and reuse**.

**Next:** [Chapter 10](10-publishing.md) shows how maintained sources become published outputs.

<!-- interactive: chapter-quiz -->
