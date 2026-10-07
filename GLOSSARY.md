# Shared Vocabulary

These definitions describe how terms are used in this tutorial.

| Term | Meaning |
| --- | --- |
| Source | Editable material used to create or update other material |
| Information item | A unit maintained and reviewed as a whole, such as a procedure, requirement, dataset, or visual asset |
| Approval scope | The specific item, collection, or deliverable and version covered by a review decision |
| Information-as-code | This tutorial's broader framing for applying versioning, review, and repeatable processing to text, models, visuals, and data |
| Record | An identifiable item containing prose and metadata, such as a requirement |
| Metadata | Fields describing content, such as its ID, owner, and status |
| Authoring template | A starting structure for creating a record or document |
| Output template | A layout for presenting selected source material |
| Schema | Rules defining required fields, data types, and allowed values |
| Generated output | Material produced by processing sources, ready for inspection |
| Published output | An output made available to its intended audience |
| Repository | Files and their version history |
| Working tree | The files currently available for editing in a local repository |
| Repository root | The top-level project folder, containing this project's README and scripts |
| Commit | A recorded revision; a local commit is not automatically sent to GitHub |
| Push | Sending local commits to a remote repository, such as one on GitHub |
| Clone | A working copy of a repository and its history, usually on your computer |
| Fork | A separate repository under another account or organization, connected to the original project |
| Branch | A separate line of development within a repository |
| Diff | A comparison showing changes between versions |
| Pull request | A proposal to review and merge changes from a branch |
| Draft | Content still being developed or reviewed |
| Approved | A specified version of content accepted through a defined review process; not blanket approval of a repository or proof of implementation |
| Complete | An item that meets its stated completion criterion; the meaning depends on the record type |
| Workflow | A configured automated process with triggers, jobs, and steps |
| Runner | The machine executing a workflow job |
| Artifact | Output files retained from an automated run |
| Large language model (LLM) | An AI model trained on large amounts of text to interpret and generate language; it can use supplied context for tasks such as drafting, summarizing, and analysis |
| AI context package | Selected sources and task instructions supplied to an AI tool |
| AI-native documentation | Information maintained for people and AI tools to use through clear context, traceable changes, and reviewable results |
| Retrieval | Finding relevant source items for a task using identifiers, metadata, links, or search |
| Retrieval-augmented generation (RAG) | Retrieving relevant external information and supplying it to a model to support its response; it does not require one particular storage or search technology |
| Adaptation through context | Supplying local knowledge and task guidance to shape a model's response without changing its underlying parameters |
| Agent skill | Reusable guidance for performing a particular type of task |
| Agent harness | The surrounding system that supplies context, runs tools, and checks or records an agent's work |
| Agentic AI tool | An AI tool that can take a sequence of actions, inspect results, and adjust its work using available tools |

A template guides authoring; a validator checks structure against a schema. A commit records a revision; a push shares it with a remote. A generated output can be reviewed before it becomes a published output.
