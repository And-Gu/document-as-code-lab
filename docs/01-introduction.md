---
id: 01-introduction
chapter_number: 1
status: in-review
learning_goal: "Explain why processable information matters now and distinguish maintained sources from their uses."
visuals:
  - id: why-now
    status: source-ready
    kind: diagram
    preferred_source: mermaid
    source: ../assets/diagrams/01-why-now.mmd
    embedded: true
    outputs: [web, pdf, slides]
    caption: "Software-driven development, AI-native workflows, and digital engineering all benefit from accessible, maintained information."
    alt: "Software-driven development, AI-native workflows, and digital engineering connect to accessible, maintained information and versioned processing rules."
  - id: source-to-outcomes
    status: source-ready
    kind: diagram
    preferred_source: mermaid
    source: ../assets/diagrams/01-source-to-outcomes.mmd
    embedded: true
    outputs: [web, pdf, slides]
    caption: "Procedure text supplies handbooks and training material. Task records supply progress and readiness views."
    alt: "Procedure text is selected and assembled into a handbook and training material. Separate task records provide progress and dependencies used to calculate readiness for the next activity."
---

# Document-as-Code: Information We Can Work With

A document is useful when someone can read it. Information becomes more powerful when we can also update, connect, check, and reuse it. **Document-as-Code** applies practices from software development to information: maintain readable sources, record changes, review proposed updates, and automate repeatable work.

This tutorial is both an introduction and a working example. Its source material is maintained as [Markdown files in the repository](https://github.com/And-Gu/document-as-code-lab/tree/main/docs). Astro builds the [reading website](https://and-gu.github.io/document-as-code-lab/) from those same files. The website adds interactive practice and dashboards; GitHub's Markdown preview remains a readable version without those controls.

## Why now?

**Software-driven development.** Products and services change through frequent software updates. Requirements, procedures, plans, and evidence need to keep pace—not be assembled into disconnected documents long after the work happened.

**AI-native workflows.** AI tools can draft text, inspect files, suggest changes, and run processing steps. To work reliably, they need accessible sources, sufficient context, clear instructions, and results that people can verify. AI increases what is possible; it does not remove the need for ownership and review.

**Digital engineering.** Teams increasingly connect plans, models, interfaces, tests, and operational evidence. That becomes difficult when information is trapped inside separate presentations or documents that cannot be processed together.

These trends do not make Document-as-Code mandatory. They make its central idea more useful: **maintain information in a form that people and tools can work with.**


```mermaid
flowchart LR
 S[Software-driven development] --> N[Accessible and maintained information]
 A[AI-native workflows] --> N
 D[Digital engineering] --> N
 N --> R[Versioned sources and processing rules]
```

*Software-driven development, AI-native workflows, and digital engineering all benefit from accessible, maintained information.*


## From a document to maintained information

Consider an onboarding process. New colleagues need to request system access, collect equipment, and find the right contacts. These are tasks people carry out. Procedures explain how to do them; their text may appear in a handbook or training guide.

Tracking the work requires different information. A task record might show that one colleague has received equipment but is still waiting for system access. These records can supply a progress overview. They do not replace the instructions, and reviewing an instruction does not complete anyone's task.

We could copy instructions into each publication and enter progress separately in several reports. But every change would then require finding and updating those copies.

A different approach is to maintain each kind of **source information** where it belongs and configure outputs to use it. Handbooks and training guides can reuse procedure text. Progress reports can use task records. A readiness overview can use completed tasks and their dependencies to show whether the next activity can begin.

The source might be Markdown text, structured data, or both. A document is one way to present that information, not necessarily the only way.


```mermaid
flowchart LR
 P[Procedure text] --> R[Select and assemble]
 R --> H[Onboarding handbook]
 R --> T[Training material]
 A[Task progress and dependencies] --> C[Calculate readiness]
 C --> V[Readiness overview]
```

*Procedure text supplies handbooks and training material. Task records supply progress and readiness views.*


**Reuse of text and information is designed, not automatic.** Saving text in Markdown or GitHub does not eliminate duplication. Someone must decide what information is shared and how each output uses it.

## Explore the Onboarding Lab

Throughout this tutorial, we use a small fictional onboarding system. It includes three procedures: access, equipment, and contacts. Separate task records represent a colleague's progress. Later chapters explain how owners, review states, task completion, and dependencies support different views.

### A fictional change to follow

Suppose a colleague has completed security training but is still waiting for system access. System orientation requires both, so it cannot begin yet. The readiness overview shows this dependency. Once access is available, it shows that orientation can start; it does not mark orientation itself as completed.

The access procedure could already be reviewed and approved throughout this scenario. Its approval concerns the instructions, not the colleague's progress.

The website offers a browser-only simulation of this scenario. It does not update files, grant access, or approve procedures.

<!-- interactive: onboarding-lab -->

The existing [procedure sources](../examples/onboarding-showcase/README.md) also produce a fixed [handbook review copy](../assets/onboarding-showcase/handbook.md), [training excerpt](../assets/onboarding-showcase/training-excerpt.md), and [review-status chart](../assets/onboarding-showcase/review-status.png). The chart answers a different question: which instructions still need review? Contacts is still a draft in that example, so the handbook is not an approved publication.

Both examples follow the same principle: maintained information → explicit rules → useful results. The sources and rules differ because the views answer different questions. Later chapters unpack each part.

## Beyond documentation

The same approach can support checklists, reports, diagrams, simulation inputs, dashboards, and AI-assisted work. It can also help teams review not only information but the rules that process it.

We will explore where information lives, how its changes are recorded, how Markdown and metadata work, and how processing produces different results. You can follow the demonstrations without installing development tools. The actual repository is available for readers who want to inspect the implementation.

Choose one instruction, plan, or report from your own work. Keep it in mind as you explore its possible owners, review process, and outputs in later chapters. [The shared vocabulary](../GLOSSARY.md) explains unfamiliar terms.

> **Takeaway:** Document-as-Code is not primarily about writing a document in a different editor. It is about making information maintainable, traceable, reusable, and processable.

<!-- interactive: chapter-quiz -->
