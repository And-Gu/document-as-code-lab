---
id: github-workspace
chapter_number: 2
status: approved
learning_goal: "Distinguish a repository, Git and GitHub, and follow the path from proposed edit to accepted source."
visuals:
  - id: git-github
    status: source-ready
    kind: diagram
    preferred_source: mermaid
    source: ../assets/diagrams/02-git-github.mmd
    embedded: true
    outputs: [web, pdf, slides]
    caption: "Git records versions; GitHub hosts the repository and adds collaboration and automation."
    alt: " G[Git: commits, branches, diffs] --> H[GitHub: hosted repository];  H --> R[Pull requests and reviews];  H --> A[Automation]"
  - id: change-path
    status: source-ready
    kind: diagram
    preferred_source: mermaid
    source: ../assets/diagrams/02-change-path.mmd
    embedded: true
    outputs: [web, pdf, slides]
    caption: "Recording, reviewing, merging, and publishing are separate steps."
    alt: " E[Edit source] --> C[Commit];  C --> P[Propose pull request];  P --> R{Review and checks pass?};  R -->|No| E;  R -->|Yes| M[Merge accepted change];  M -.-> B[Separate build and publication]"
---

# A Shared Workspace for Information

When information matters to several people, they need to know where it lives, what changed, and which version to trust. In this tutorial, we use a **Git repository hosted on GitHub** as our shared workspace.

## Repository, Git, and GitHub

A **repository** is a collection of maintained files and their change history. It can hold documentation, structured data, diagrams, tests, and the instructions that process them.

**Git** records changes to those files, preserving their history so that people can compare versions and work on changes separately.

**GitHub** hosts repositories and adds collaboration tools, including pull requests, access management, and automation. Git and GitHub are not synonyms: Git can work without GitHub, and comparable hosted platforms also exist.


```mermaid
flowchart TB
 G[Git: commits, branches, diffs] --> H[GitHub: hosted repository]
 H --> R[Pull requests and reviews]
 H --> A[Automation]
```

*Git records versions; GitHub hosts the repository and adds collaboration and automation.*


A **workspace** is broader than the repository itself. It includes the editors, people, workflows, and tools used to maintain the information. In this project, GitHub hosts the repository where the team shares and reviews changes. Authors can edit files directly on GitHub or work on a copy of the repository stored on their own computer, using an editor or AI assistant. Changes made on that computer must be sent to GitHub before others can review them there.

## Branches, Commits, and Pull Requests

Changes move from an author's working version into the shared source through a few distinct steps:

- **Branch:** A separate line of work where changes can be prepared without changing `main`, the shared baseline.
- **Commit:** A recorded set of changes, with a message explaining what changed.
- **Diff:** A comparison showing the lines added, changed, or removed.
- **Pull request (PR):** A proposal to bring changes from one branch into another, with discussion, review, and checks.
- **Merge:** Incorporating those changes into the target branch, usually `main`.

## Follow a proposed change

Suppose the access instructions used in chapter 1 need a new step. The contributor edits the source on a branch and commits the change. A pull request presents the proposed change for review. Reviewers can compare versions, discuss the wording, and check whether related outputs still work.

After acceptance, the change can be merged into the main branch. This updates the maintained source. Any published output changes only when its build or publishing process runs successfully.


```mermaid
flowchart LR
 E[Edit source] --> C[Commit]
 C --> P[Propose pull request]
 P --> R{Review and checks pass?}
 R -->|No| E
 R -->|Yes| M[Merge accepted change]
 M -.-> B[Separate build and publication]
```

*Recording, reviewing, merging, and publishing are separate steps.*


Three things are different:

- **Recorded:** Git remembers a revision.
- **Reviewed:** Someone has inspected and accepted a proposed change.
- **Published:** Readers can access a resulting output.

One does not automatically guarantee the others. A successful build shows that configured checks ran; it does not establish that the content is correct or approved.

## The Onboarding Lab in the repository

Our example has procedure files such as `access.md`, `equipment.md`, and `contacts.md`. See the [maintained procedure files](../examples/onboarding-showcase/README.md). Those files are sources, not separate copies of every handbook or presentation that uses them. As the lab grows, related configuration, data, tests, and processing code can live alongside them.

## Explore without installing anything

In the [real repository](https://github.com/And-Gu/document-as-code-lab), start with the [README](../README.md), locate the chapter and onboarding files, and look at the history of one file. Reading and exploring should not require creating an account. Modifying a repository is an optional advanced activity.

As you explore, you will find more than the information itself. The repository also holds rules for checking changes and publishing results. For example, a proposed change can trigger a website build check, while an accepted change can trigger publication. GitHub Actions runs this automation; later chapters explain its workflows and runners.

With suitable permissions, the team can improve these rules alongside the information. An AI agent can use both as context when helping with changes, while people remain responsible for reviewing the results and maintaining the tools.

For now, remember the essential relationship: **the repository holds maintained sources; Git records their history; GitHub provides a shared place to work with them.**

<!-- interactive: chapter-quiz -->

Next, [chapter 3](03-project-growth.md) connects recorded history to useful reports.
