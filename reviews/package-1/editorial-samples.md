# Package 1: representative editorial changes

Candidate wording for owner review, 25 October 2026. Audience direction is agreed; final copy and visual treatment are not approved. These are targeted changes, not a site-wide prose rewrite. Before excerpts come from specification PR #18 head `b816ec79342fef680d01e286aa5d22c278151aa5` (application baseline matches `9b63bdb`).

## Homepage

Start with the opportunity in familiar information work. Keep document-as-code as the concrete demonstration and put the existing Processing Lab beside the reading entry.

### Before

```html
<p class="home-eyebrow">The living tutorial & engineering lab</p>
        <h1 id="home-title">Document-as-Code</h1>
        <p class="hero-headline">From static documents to information we can work with.</p>
        <p>Document-as-Code applies software engineering practices to the management of information. Sources are maintained in readable formats, changes are versioned and reviewed, and automated processes can validate, transform, and publish the information.</p>
```

### After

```html
<p class="home-eyebrow">Document-as-Code Lab</p>
        <h1 id="home-title">New ways of working with information</h1>
        <p class="hero-headline">Better collaboration, more automation, and new uses for AI agents.</p>
        <p>Discover new ways of working beyond individual documents and information scattered across or locked inside business systems. Explore how that information can be connected, refined, and reused—with clear sources, review, and responsibility.</p>
```

## Chapter 1: why now

Replace the engineering-led trend frame with documents/system boundaries, repeated checks and source-backed assistance. Retain the opening onboarding example and its lab.

### Before

```markdown
## Why now?

Frequent software updates mean that requirements, procedures, and evidence need to keep pace with products and services. This **software-driven development** makes repeated manual updates harder to sustain.

**AI-native workflows** add another reason to make information accessible. AI tools can inspect sources, propose edits, and run processing steps when they have suitable tools and permissions. Clear instructions, relevant context, and reviewable results help people assess that work.

In **digital engineering**, teams connect plans, models, interfaces, tests, and operational evidence. Separate documents remain useful, but their information also needs to work across those connections.

All three benefit from information that people and tools can inspect and process together.
```

### After

```markdown
## Why now?

Many teams work across Word documents, spreadsheets, PDFs, and specialized business systems. A system may hold well-structured information while colleagues still connect it manually with information from elsewhere. Preparing a decision brief can mean checking which source is current and what each date or status means.

AI assistance often starts with drafting or improving text. With suitable sources, tools, and permissions, an agent could also compare information, find gaps, and prepare changes for review. Repeatable processing can help with the same work even without AI.

The opportunity is to improve how people collaborate around information, automate repeated steps, and make new kinds of agent assistance possible. Document-as-code gives us a small, inspectable demonstration of those working methods.
```

## Chapter 8: bounded information task

Add one practical distinction beyond rewriting text. Preserve the existing project-knowledge explanation, access/authority boundaries and scenario check; do not introduce package 2’s walkthrough.

### Before

```markdown
An **AI agent** combines a language model with tools for operations such as reading files, editing sources, and running checks. A chat prompt describes the task; repository access comes from the configured tools and permissions. The sources and processing rules from earlier chapters provide useful context; the actual repository adds the conventions and rationale needed to work on the project.
```

### After

```markdown
An **AI agent** combines a language model with tools for operations such as reading files, editing sources, and running checks. A chat prompt describes the task; repository access comes from the configured tools and permissions. The sources and processing rules from earlier chapters provide useful context; the actual repository adds the conventions and rationale needed to work on the project.

An assistant can help rewrite a status report. A tool-enabled agent could also gather permitted sources, compare a forecast with a commitment, identify missing support, and prepare a source-linked draft. That requires the meaning of the fields, suitable tools, and clear limits on what the agent may change. People still decide how to resolve uncertainty and whether to accept a proposal.

Here we inspect the project knowledge that supports such work. This chapter runs no AI model and gives no agent automatic access to business systems.
```
