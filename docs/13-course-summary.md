---
id: course-summary
chapter_number: 13
status: approved
learning_goal: "Connect the four parts of the course and recognize where the same practices can help in everyday information work."
---

# Bringing It Together

An instruction changes, and a team needs to update a handbook, a training guide and a website. That was our starting question: how can these materials use the same maintained information?

Each part of the course added something to the answer. We found a shared place to work, gave the information enough structure for tools to use it, explored new uses for it and followed the results to readers.

## Work with maintained sources

1. [Document-as-Code: Information We Can Work With](01-introduction.md)
2. [A Shared Workspace for Information](02-github-workspace.md)
3. [History Is Useful Information](03-project-growth.md)
4. [Markdown: Readable Sources](04-markdown.md)

**Where should we make the change?** In the maintained source: the place the team updates and the other materials draw from.

For the onboarding example, that source was a procedure written in Markdown. Its readable text made the instructions easy to inspect. Git recorded revisions, and a GitHub pull request gave colleagues a place to compare the proposed wording and discuss it before merging.

<figure class="example-flow">
  <figcaption>One instruction changes</figcaption>
  <ol role="list">
    <li><strong>Edit the procedure</strong><span>Add a step to the maintained access instructions.</span></li>
    <li><strong>Inspect the difference</strong><span>See exactly what changed from the earlier revision.</span></li>
    <li><strong>Review and merge</strong><span>Discuss the proposal and bring the accepted change into the shared source.</span></li>
  </ol>
</figure>

A support team can use this idea for instructions shared by a staff guide and training material. The useful starting point is an agreed source and a visible way to review changes. History then helps explain how the instructions developed.

## Make information processable

5. [Structure Makes Information Actionable](05-structured-content.md)
6. [Information Architecture and Traceability](06-information-architecture.md)
7. [From Sources to Results](07-processing.md)

**How can tools use the source?** We added fields with agreed meanings: an ID to identify the procedure, an owner and a review status. These fields are **metadata**, information describing the content. Named relationships connected records, while a **schema** defined which fields and values were expected.

The processing lab put those ideas to work. It checked the procedure files, assembled their text into a handbook review copy and selected draft procedures for a review queue.

<figure class="example-flow">
  <figcaption>The same source supports two uses</figcaption>
  <ol role="list">
    <li><strong>Read the procedures</strong><span>Use the instructions and their metadata.</span></li>
    <li><strong>Check and apply rules</strong><span>Validate the fields, assemble the text and select drafts.</span></li>
    <li><strong>Produce the results</strong><span>A handbook review copy contains the instructions. A review queue lists work awaiting review.</span></li>
  </ol>
</figure>

The results respond to different changes. Editing an instruction changes the handbook text after a successful build. Changing a procedure’s status can change the review queue.

A maintenance team could use the same pattern to prepare a guide and a list of procedures needing attention. Stable IDs and source references help people trace each result back to the information that produced it.

## Use and enrich information

8. [Making Information Usable by AI Agents](08-ai-native.md)
9. [Information You Can Explore](09-images.md)
10. [From Data to Knowledge](10-data-enrichment.md)

**What else can we do with accessible, connected information?** We can use it to answer questions, investigate a finding and prepare further work.

In Chapter 8, an agent needed relevant sources, definitions and project guidance to make a useful change. Keeping that context as searchable text helped it find information and compare wording across files.

In Chapter 9, we asked how a procedure’s review status becomes a review queue. The knowledge graph connected the concepts and pointed to the chapter that explained the processing rule. An agent could follow the same connections and read the supporting sources.

<figure class="example-flow">
  <figcaption>Find the explanation behind a result</figcaption>
  <ol role="list">
    <li><strong>Start with the question</strong><span>How does review status determine what appears in the queue?</span></li>
    <li><strong>Follow the connections</strong><span>Metadata connects to Processing, which produces a Derived view.</span></li>
    <li><strong>Read the source</strong><span>Chapter 7 explains how the processor selects draft procedures.</span></li>
  </ol>
</figure>

Chapter 10 extended this work from finding information to learning something from it. Five support-case records gave us three usable durations. We checked the dates, explained the excluded cases, calculated a median and kept the records and method with the finding.

A team preparing a service report could combine these practices: find relevant records, ask an agent to help check and calculate, then review the finding against its sources. The saved explanation makes the next report easier to prepare and check.

## Make it a working environment

11. [Automating Information with GitHub Actions](10-publishing.md)
12. [Behind the Lab: How We Built This Tutorial](11-beyond-github.md)

**How do we repeat the work and get the result to readers?** We define when the checks and processing should run, and where their outputs should go.

The tutorial itself demonstrated this. A proposed chapter edit starts checks. After the change is merged, GitHub Actions runs the website build with Astro and deploys the result to GitHub Pages.

<figure class="example-flow">
  <figcaption>A maintained change reaches the reader</figcaption>
  <ol role="list">
    <li><strong>Propose and check</strong><span>A pull request brings together the edit, check results and discussion.</span></li>
    <li><strong>Build the website</strong><span>Astro combines the current sources with layouts and interactive components.</span></li>
    <li><strong>Publish the result</strong><span>Deployment makes the built files available through GitHub Pages.</span></li>
  </ol>
</figure>

A build prepares a result; publication makes it available to its audience. The architecture explorer helped us follow both the source and the update process for each output.

A team using Word and SharePoint can ask the same questions about its own guides and reports. Where is the maintained information? How are changes reviewed? What updates the result readers use?

## Bring the parts into one piece of work

Return to the instruction shared by the handbook, training guide and website. It now has a maintained source, an inspectable history and fields that processing rules can use. People and agents can find related information. Defined checks and publishing steps carry accepted changes to readers.

Choose one recurring information task in your work and sketch that path. Identify the source, the people who maintain it, the rules needed to use it and the result someone needs. Those connections are the foundation we have introduced throughout the course.
