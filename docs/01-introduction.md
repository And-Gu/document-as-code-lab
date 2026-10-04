---
id: 01-introduction
chapter_number: 1
status: draft
audience: practitioners-familiar-with-documents-and-visual-tools
learning_goal: Identify reusable information, its owner, and useful documents or visualizations built from it.
visuals:
  - id: onboarding-assembly
    status: source-ready
    kind: diagram
    purpose: Show three source files forming a handbook and supporting additional views.
    placement: after-from-source-files-to-documents
    preferred_source: mermaid
    source: ../assets/diagrams/onboarding-assembly.mmd
    embedded: true
    outputs: [web, pdf, slides]
    caption: Three files form a handbook review copy; their content and metadata also serve other needs.
    alt: Access, equipment, and contacts files all feed a handbook review copy. Access also feeds a training excerpt, while metadata from all three files feeds a review dashboard.
  - id: onboarding-review-status
    status: source-ready
    kind: chart
    purpose: Identify how much material is awaiting review and who should act.
    placement: after-a-dashboard-from-the-same-files
    preferred_source: matplotlib
    source: ../scripts/build_onboarding_showcase.py
    generated_asset: ../assets/onboarding-showcase/review-status.png
    data: ../assets/onboarding-showcase/data.json
    outputs: [web, pdf, slides]
    caption: Two procedures are marked approved and one remains draft in this fictional dataset.
    alt: Horizontal bars show two approved procedures and one draft. The accompanying table identifies team contacts, owned by the people team, as the draft.
---

# Document-as-Code: The Living Tutorial

Document-as-Code Lab is both a tutorial for learning document-as-code and a showcase for exploring how a project's information and history can be visualized. We use our own content and its changes over time to develop charts, diagrams, dashboards, presentations, and PDF documents.

My motivation for creating this tutorial comes from using document-as-code in my own work. I have applied it to product development, roadmap work, and planning, as well as budgeting and workforce planning in my role as a line manager. For me, its relevance extends beyond documentation to how we organize information and use it in everyday decisions.

I have also worked in an organization trying to understand and adopt this way of working. It brings challenges: moving to document-as-code can be a substantial change in established practices, often alongside the introduction of AI support in the workplace. Adopting the tools is only part of that transition; people also need to understand how their work and responsibilities change.

After using the approach for a while, my experience is that it has significant potential, but realizing that potential requires education, support, and a shared understanding. That is why I created this tutorial: to make the approach tangible through examples, explain the choices involved, and provide room to learn by doing.

The project is for anyone who wants an introduction to the principles of document-as-code. It also introduces closely related concepts, such as automation, information reuse, visualization, and AI-supported work. Beginners can follow the concepts and exercises without prior experience with software development tools. More experienced readers can examine the examples and the rules behind their visualizations.

This chapter follows one onboarding example from editable instructions to a handbook, training material, and a visual overview of what needs review. At the end, you will identify a similar opportunity in your own work. The [shared vocabulary](../GLOSSARY.md) explains unfamiliar terms.

## From Source Files to Documents

Document-as-code applies software development practices to documentation. You maintain the original, editable content in files, which we call source files. You keep a history of changes and use repeatable processes to check the content and prepare it for readers.

To see what this means in practice, imagine preparing a handbook for new colleagues. They need to know how to request system access, collect their equipment, and find the right people to contact. These instructions belong together in the handbook, but different teams are responsible for keeping the parts up to date.

In our fictional example, each team maintains its instructions in a separate file. We can present those parts as a handbook without keeping all the text in one file. The files are organized around who maintains the information, while the handbook is organized around what a new colleague needs.

Here are the three files we will use. Their names end in `.md` because they contain text in a format called Markdown. For now, you can simply open them and read the instructions; [chapter 4](04-markdown.md) explains the format.

| Source file | What it contains | Who maintains it | Status |
| --- | --- | --- | --- |
| [access.md](../examples/onboarding-showcase/access.md) | How to request system access | Onboarding team | Approved |
| [equipment.md](../examples/onboarding-showcase/equipment.md) | How to collect equipment | Workplace team | Approved |
| [contacts.md](../examples/onboarding-showcase/contacts.md) | How to find team contacts | People team | Draft |

The status is recorded at the top of each file. For example, `contacts.md` contains `status: draft`, indicating that its instructions still need review. Fields such as status and owner are called metadata: information describing the content. We will look inside a file shortly and explore metadata further in [chapter 5](05-structured-content.md).

The table above could itself be the starting page of a simple handbook. We store this project on GitHub, a cloud service where people can share files, review changes, and keep a history of their work. GitHub displays our instruction files as readable pages, so a new colleague can follow the three links to find what they need. There is no need to generate a separate document or build a website first. Readers simply need access to the shared project, called a repository. [Chapter 2](02-github-workspace.md) introduces this workspace in more detail.

A handbook link can lead readers to the current instructions, even as those instructions change. The team can review each update before making it available to readers, so they do not need a new link whenever the text is revised. This requires a review process; the link itself does not guarantee that the instructions have been reviewed. For a fixed edition of the handbook, links can instead point to the exact versions reviewed for that edition.

We can also bring the text together when readers need one continuous document. This project includes a small program, called a [script](../scripts/build_onboarding_showcase.py), that reads the three files and creates a handbook review copy, an access-only training excerpt, and a status chart. The chart forms part of the review dashboard shown later in this chapter: a visual overview of which instructions need attention.

Read the diagram from left to right. Each arrow means "provides information for": all three files supply text for the handbook, only the access file supplies text for the training excerpt, and all three supply status and owner information for the dashboard. The arrows show how the same information is reused in different outputs.

```mermaid
flowchart LR
    access["access.md"]
    equipment["equipment.md"]
    contacts["contacts.md"]
    handbook["Handbook review copy: all three procedures"]
    training["Training excerpt: access procedure"]
    dashboard["Review dashboard: status and owner"]
    access --> handbook
    equipment --> handbook
    contacts --> handbook
    access --> training
    access --> dashboard
    equipment --> dashboard
    contacts --> dashboard
```

*Three files form a handbook review copy; their content and metadata also serve other needs.*

### From a Review Copy to a Published Handbook

The [handbook review copy](../assets/onboarding-showcase/handbook.md) brings all three sets of instructions together. As the table shows, the team contacts section still needs review, so this example handbook is a draft rather than a finished guide for new colleagues.

If all three procedures had been reviewed and approved, the team could prepare a handbook for new colleagues using those approved versions. It could share a starting page linking to the instructions in GitHub, or assemble them into one document for publication. Before release, the person responsible for the handbook would still check that the parts work together: nothing important is missing, the instructions do not conflict, and the links and presentation are suitable for readers.

Once those checks and any required publication approval were complete, the team could release a fixed edition tied to the reviewed versions. Alternatively, it could maintain a linked handbook whose instructions are reviewed whenever they change.

### Reusing the Access Instructions for Training

The arrow from `access.md` to the training excerpt shows a different use of the same source. The script copies only the access instructions into a [training excerpt](../assets/onboarding-showcase/training-excerpt.md). It does not write a lesson or create slides. A trainer can use that excerpt to prepare explanations, exercises, or a presentation suited to the group being trained.

The responsibilities are different here: the onboarding team maintains the original instructions in our fictional example, the people maintaining the project look after the script, and the trainer checks and adapts the material for the session. When the instructions change, a project maintainer runs the script again and reviews the updated excerpt. The trainer then checks whether the teaching material also needs updating. In this example, creating updated outputs is a deliberate action, not a process that runs automatically after every edit.

### A Dashboard from the Same Files

The third output in the earlier diagram is the review dashboard. You do not need to open another application to find it: it is the chart and table below, presented together in this chapter.

The dashboard helps a team or organization keep track of its information, see what needs attention, and make responsibilities clear. This supports more consistent, up-to-date instructions. Here, it answers a practical question: **which procedure needs review, and who should act?**

Each instruction file records its review status and the team responsible for it. The example script counts how many procedures have each status to create this chart:

![Two procedures are marked approved and one is draft in the fictional onboarding example.](../assets/onboarding-showcase/review-status.png)

*Two procedures are marked approved and one remains draft. These values describe the fictional example, not the tutorial's chapter completion.*

The count shows how much attention is needed; the accompanying table identifies the item and the responsible team.

| Procedure | Status | Owner |
| --- | --- | --- |
| Requesting access | Approved | Onboarding team |
| Collecting equipment | Approved | Workplace team |
| Finding team contacts | Draft | People team |

The useful next action is to ask the people team to review the contacts procedure. A total alone would not tell us that. This is the kind of relationship between data, presentation, and decisions that the showcase explores.

You can inspect the [input data](../assets/onboarding-showcase/data.json) and [generation script](../scripts/build_onboarding_showcase.py). The [example notes](../examples/onboarding-showcase/README.md) explain how to regenerate the outputs later. No tool installation is needed to read them now.

Who keeps this dashboard up to date? In this repository, maintaining the example means maintaining both the script and this chapter. The script generates the saved chart when someone runs it; the table above is written in the chapter and must be updated to match. Neither refreshes itself when a source file changes. In a working team, the procedure owners would maintain their records, while a designated maintainer would look after the dashboard and its generation process. Later chapters explore how to automate more of that work.

We have now seen all three outputs from the diagram: the handbook, the training excerpt, and the dashboard. Next, we will look inside one instruction file to see how its text and descriptive information support these different uses. Later in the project, we will build on this approach to produce a website, a PDF book, and finished presentations.

## Inside the Access Procedure

A new colleague needs instructions, a trainer needs material for a session, and the onboarding team needs to know who maintains the procedure. The same file can provide all three with useful information.

Here is the complete access source from the example:

```markdown
---
id: PROC-001
owner: onboarding-team
status: approved
---

# Requesting Access

Submit an access request through the service portal. State which system you need and which team you belong to. Keep the confirmation reference number and include it when asking the service desk about progress.
```

The fields between the `---` lines are metadata: information describing the procedure. The `id` gives it a stable name, the `owner` identifies the team responsible for it, and the `status` records its review state. The rest is the instruction a reader needs.

We chose these fields to suit our example: identifying each procedure, assigning responsibility, and tracking review. They are not required by document-as-code or GitHub. Your team can choose different fields according to what it needs to manage, automate, or present.

Those fields become useful when tools are configured to interpret them. Here is how the text and metadata contribute to different views:

| View | What it uses | What it helps someone do |
| --- | --- | --- |
| Handbook | Full procedure text | Follow the onboarding process |
| Training excerpt | Access instructions | Prepare an explanation for new colleagues |
| Dashboard | Status and owner | Find material that needs attention |
| Background material for an AI assistant | Selected text, version, audience, and task | Draft material suited to a particular purpose |

The example script creates the handbook, training excerpt, and dashboard chart; the dashboard's accompanying table is maintained in this chapter. In [chapter 6](06-ai-native.md), we will assemble background material and instructions for an AI assistant into what we call a context package.

## Review the Part That Changed

In a conventional document workflow, reviewers may track individual edits in Word while approving a whole manual as one deliverable.

When each procedure is kept in its own file, for example in a shared project on GitHub, reviewers can focus on the procedure that changed. [Chapter 2](02-github-workspace.md) explains how that shared workspace works. If the access process changes, the onboarding team reviews that procedure and its effect on the handbook and training material.

Recording a change and approving it are separate actions. Saving a version in the project's history records what the files contained at that point, including any drafts. It does not mean that someone has approved them. Approval means someone has reviewed and accepted particular content. If that content changes again, the new wording may need another review.

In our example, `approved` refers to the procedure's review state. The contacts procedure remains draft, so assembling the files does not make the handbook an approved publication. The complete output still needs checks for consistency, completeness, and presentation.

The [collaboration chapter](08-git-review.md) develops review workflows, while [structured content](05-structured-content.md) explains the rules behind fields such as status.

## What This Enables in Everyday Work

When the access process changes, the team updates one source, reviews its consequences, and regenerates the views that use it. Each capability supports a different part of that work:

- **Version control** records what changed and why.
- **Focused review** directs attention to the changed information and its dependencies.
- **Automation** rebuilds outputs and checks repeatable rules.
- **Reuse** keeps shared facts together while supporting different audiences.
- **Visualization** makes patterns, relationships, and outstanding work easier to inspect.

Document-as-code brings the benefits of the software development discipline to information work and is particularly useful when working with large language models (LLMs). Clear sections, defined terms, and recorded decisions help you provide an LLM with relevant context for a specific task.

For example, give an AI assistant the access procedure, the intended audience, and a request for a short training explanation. Compare its draft with the source before using it. This supports AI-native documentation: organizing information so people and AI tools can use it in everyday work. [Chapter 6](06-ai-native.md) develops that approach.

The broader shift is from producing individual documents to also developing the system that maintains them. The team can improve its templates, metadata, scripts, and checks as its needs change. AI agents can help turn those needs into tested changes, not just generate more text.

Making these improvements requires more than tools that can be changed. The people doing the work also need permission and support to change them. For example, a document management system may support custom workflows, but users may depend on another department to implement even a small improvement.

Document-as-code offers a way to bring that control closer to the people doing the work, provided the organization gives them the necessary permissions and responsibility. The benefit is the ability to improve everyday work without handing every change to another team's queue. [Chapter 2](02-github-workspace.md) explores this ownership and its maintenance obligations.

Versioned text, review, and automated publishing predate today's generative AI tools. AI adds another use for those maintained sources. [Write the Docs describes the established docs-as-code practices](https://www.writethedocs.org/guide/docs-as-code/).

## When Your Main Medium Is Not Text

Your source might be a systems model, an illustration, an animation, or a dataset. We use "information-as-code" as a broader description of applying versioning, review, and repeatable processing to those sources.

The same question applies: **what do you maintain, and what views do people need from it?**

| Main medium | Source to maintain | Possible output |
| --- | --- | --- |
| Systems model | Model elements and relationships | Diagrams and selected explanations |
| Illustration | Editable design file | Images for manuals and presentations |
| Animation | Editable project, script, and assets | A rendered sequence |
| Dataset | Records and transformation rules | Charts, tables, and dashboards |

Preserve the editable source as well as useful exports. Some formats require specialist tools to compare changes or reproduce an output, so the review method needs to fit the medium.

This tutorial begins with text and small datasets, then expands into visual assets. [Chapter 7](07-images.md) covers those assets, and [chapter 10](10-publishing.md) covers publishing choices. [Beyond GitHub](11-beyond-github.md) explores how lighter workflows can use familiar applications.

## Try It: Find a Reusable Part in Your Own Work

Choose a document, presentation, model, or set of instructions that you maintain. You can do this exercise on paper or in your usual note-taking tool.

1. Identify one part that changes independently, such as a procedure, diagram, or data table.
2. Name the person or team best placed to maintain and review it.
3. Describe two documents or views that could use that same information.
4. Choose one field, such as owner or review status, that would help you answer a practical question.
5. Describe how you would check the outputs after changing the shared source.

**Expected result:** a small, concrete opportunity for reuse. For example: "Our equipment checklist is owned by the workplace team, appears in the handbook and training material, and has a review status that identifies pending work."

**If it is difficult to choose a part:** start with something you currently copy between files or update on a different schedule from the surrounding content.

**Keep:** a short note naming the information item, its owner, two uses, and the question its metadata could answer. We will return to these ideas as the tools become more concrete.

Next, [GitHub as a Workspace for Knowledge and Automation](02-github-workspace.md) introduces the environment and your first reviewable change.
