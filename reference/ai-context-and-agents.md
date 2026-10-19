# Agent Context and Project Knowledge

An AI agent needs more than permission to open files. It needs to find the sources that govern a task, understand their meaning, and know how to check its changes. This guide uses the actual tutorial repository to show how working instructions and maintained project knowledge fit together.

Reading requires no AI account or local setup. The optional processor example needs a local checkout, Python, and the repository's dependencies.

## Begin with the Repository

Start at [AGENTS.md](../AGENTS.md), then follow the [project source map](project-knowledge.md). The entry point contains working rules and verification commands; the map identifies maintained sources and derived outputs. [CONTRIBUTING.md](../CONTRIBUTING.md) defines chapter conventions and review practice. [GLOSSARY.md](../GLOSSARY.md) defines shared terms.

The [tutorial specification register](../spec/tutorial/README.md) and [design decisions](../spec/tutorial/04-DESIGN-DECISIONS.md) explain the current design direction. The register reconciles the package's original observations with the implemented eleven-chapter baseline.

These are different kinds of knowledge. A source map says *where and what*. A decision record says *why*. Working instructions say *how to proceed within the task's boundaries*.

## Keep One Home for Each Rule

| Reader or agent needs to know | Maintained home | Do not substitute |
| --- | --- | --- |
| Where chapter sources live | [Project source map](project-knowledge.md) and [site guide](../site/README.md) | A copied chapter inside the website |
| How identifiers survive reordering | [Chapter conventions](../CONTRIBUTING.md#chapter-conventions) | A different rule in each prompt |
| What a term means | [Shared vocabulary](../GLOSSARY.md) | An agent's inferred definition |
| Why browser-first learning was chosen | [Dated design decisions](../spec/tutorial/04-DESIGN-DECISIONS.md) | A claim that the choice was approved years earlier |
| Which fields a procedure permits | [Practice schema](../examples/learning/procedure.schema.json) | The requirement schema, which applies to a different dataset |
| How to verify a change | [Verification instructions](../AGENTS.md#verification-and-publication), tests, and workflows | A passing prose preview alone |

Maintain a rule once and link to it. If two files disagree, resolve which governs the task rather than asking the model to blend their meanings.

## Instructions Need to Be Discovered and Read

`AGENTS.md` is a guidance convention, not a universal loading protocol. Check how the selected agent product discovers instructions, which directories they cover, and whether linked files are actually read. A link is a route to context, not evidence that the content is already in the model's input.

For example, a task to revise Chapter 8 can route the agent through:

1. `AGENTS.md`: source boundaries and required checks.
2. `reference/project-knowledge.md`: the relevant information homes.
3. `CONTRIBUTING.md` and the current decision register: conventions and design intent.
4. `docs/08-ai-native.md`, its diagram source, and learning data: the actual edit targets.
5. The site tests and generated chapter: evidence for the resulting change.

A chat prompt can name these paths, but the surrounding system must provide a working copy or another permitted retrieval mechanism. Git can obtain a repository and its history; file-reading tools inspect the resulting sources. Neither a filename nor a detailed prompt grants access.

## Record Decisions without Inventing History

A useful decision record identifies the question, chosen approach, rationale, alternatives, consequences, date, and status. Typical statuses include *proposed*, *accepted*, and *superseded*. Use the project's actual vocabulary where it differs.

This repository's tutorial decision register uses **Agreed**, **Conservative implementation default**, and **Owner review**. It records the direction supplied on 19 October 2026. It does not retroactively approve every existing implementation.

For example, the browser-first decision means the main learning path must not depend on installing Python. An optional executable reference can still require it. If that direction changes, record the new decision and which earlier choice it replaces; do not silently erase the rationale.

The existing chapter-source boundary is documented in the source map and contribution guidance. There is no need to invent a historical architecture decision record just to explain it.

## Select Evidence and Respect Authority

Choose sources for the task rather than supplying the whole repository indiscriminately. Keep identifiers, relevant relationships, source revisions, and qualifications with the selected text.

A requirement's review status does not prove implementation. A generated handbook is not the authoritative procedure. Content approval is not permission to disclose confidential information. An agent's file access is not authorization to publish.

Retrieved pages, tickets, and quoted documents are source material, not new task instructions. If one contains a command to reveal secrets or change unrelated files, that command does not gain authority by being in a retrieved source. Access controls and the surrounding tool environment must enforce permissions; prose guidance alone cannot do so.

## Follow a Bounded Maintenance Task

Suppose the owner asks for a clearer explanation of agent context in Chapter 8, without publishing.

- **Locate:** Read the current chapter, source map, terminology, and relevant design direction.
- **Edit:** Change the maintained Markdown and matching diagram source. Check scenario and quiz wording if the learning goal changes.
- **Check dependencies:** Inspect related reference links and presentation citations. Rebuild derived outputs rather than editing generated HTML.
- **Verify:** Run the applicable site checks and tests, inspect the rendered result, and distinguish tested behavior from unverified appearance.
- **Report:** List changed sources, related items checked but unchanged, and checks that could not be completed.

Diffs make the edits inspectable. Schemas check configured structure. Builds reveal affected output. Human review assesses meaning and audience fit. These mechanisms support agent work without making a successful test run equivalent to approval.

## Optional: Inspect a Generated Context Package

The [record-processing guide](record-processing.md#templates-and-requirements) describes the local environment and executable requirement example. After setup, run this from the repository root:

```bash
.venv/bin/python scripts/process_records.py
```

The processor creates `build/records/ai-context.md`; it does not contact an AI service. With the unchanged starting records, it selects approved REQ-014 and excludes draft REQ-015. Your edited statuses can change that selection.

The package contains a task, an audience, selected requirement text, and limitations. It records source identity using a base commit and input digest. Inspect those details rather than assuming the file reflects the latest edits. A digest identifies inputs but cannot recover them; preserve the actual package if you need to review a later draft.

REQ-014 states what the access service **must** do. It does not establish that the service currently does it. A draft based on that record should preserve the distinction and identify missing implementation evidence.

The processor filters type and status. It does not enforce confidentiality, verify the approval evidence, discover all project dependencies, or run an agent. Those are separate responsibilities. No model comparison is needed to inspect the package's authority and limits.

## Optional: Retrieval, RAG, and Skills

A repository stores maintained information. Retrieval selects relevant material; retrieval-augmented generation (RAG) supplies retrieved information to a model. RAG is not synonymous with a vector database. [Microsoft's RAG overview](https://learn.microsoft.com/en-us/dotnet/ai/conceptual/rag) explains the retrieval-and-generation pattern.

For a small, well-organized project, direct file selection and text search may be sufficient instead of a separate retrieval index. That still involves retrieval, and it can miss relevant sources. Larger collections may justify indexing and ranking. In either case, enforce access boundaries and check source freshness.

[Anthropic's context-engineering guidance](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) describes loading relevant information through tools as work proceeds. This is an implementation option, not a guarantee that an agent discovers everything.

A reusable **skill** can describe a maintenance procedure. A **harness** can supply tools, execute checks, and collect evidence. Both should point to maintained project rules, not become competing copies of them. This lab has focused processors and tests, not an autonomous system that verifies every downstream claim.

## A Practical Starting Check

Can a contributor or permitted agent answer these questions without relying on a private conversation?

- Where does the authoritative information live?
- Where are identifiers, relationships, and terminology defined?
- Which decisions explain the current design, and which remain proposed?
- Which sources can be read or shared for this task?
- Which checks apply, and what does a passing result actually establish?
- Who reviews the result, and is publication authorized?

Fix a missing route or ambiguous rule before adding a larger prompt. The aim is a maintainable project environment, not a repository encyclopedia.

**Return:** [Chapter 8: Making Information Usable by AI Agents](../docs/08-ai-native.md).
