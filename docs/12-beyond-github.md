---
id: 09-beyond-github
chapter_number: 12
status: draft
audience: practitioners-adapting-document-as-code-to-familiar-workplaces
learning_goal: Design a lightweight workflow with clear sources, review, reusable context, and traceable outputs outside GitHub.
---

# Beyond GitHub: OneDrive, Copilot, and Other Applications


The previous chapter followed shared information into websites, books, and presentations. But your colleagues may work mainly in Word, PowerPoint, and shared folders. They may not have access to GitHub or permission to introduce a new publishing system.

You can still use many of the principles we have explored: maintain information in identifiable parts, make ownership clear, review changes, reuse selected sources, and check the outputs. The tools change, and some steps become manual, but the purpose remains the same.

This chapter develops a smaller onboarding workflow using OneDrive, Word, and optional Copilot support. It is an adaptation of the practices, not a claim that a shared folder provides all the capabilities of a repository and its automation.

## Keep the Principles, Change the Tools

Imagine that the onboarding team wants to improve its instructions but needs to keep using Microsoft 365. We can begin with a separate document for access, equipment, and contacts, rather than asking everyone to maintain one large handbook.

The team can review each part, choose which parts belong in a training session, and record which versions it used. It does not have to start by learning a command line or building a website.

| Practice | Repository-based example | Lightweight alternative |
| --- | --- | --- |
| Maintain a reusable part | One procedure in a Markdown file | One procedure in a Word document |
| Identify responsibility | Owner field in metadata | Owner in a small information table |
| Review a change | Pull request and review record | Tracked changes, comments, and a recorded decision |
| Retain history | Recorded repository revisions | Available file version history and retained editions |
| Assemble information | Script selects source files | Author selects documented versions using a checklist |
| Supply AI context | Selected files and task instructions | Selected documents or excerpts with the same task guidance |

The alternative is less automated, but it may be easier for the team to adopt. It also provides a way to learn which steps are worth automating before investing in a larger system.

## Give the Shared Folder a Clear Structure

OneDrive is a cloud service for storing and sharing files. For this exercise, use a training folder that you control, with fictional information only. For ongoing team work, agree with your organization where shared content should live and who is responsible when people change roles.

A simple arrangement could look like this:

```text
Onboarding practice/
  Sources/
    Access instructions
    Equipment instructions
    Team contacts
  Context packages/
    Access training brief
  Review/
    Source register and change record
  Outputs/
    Handbook review copy
    Access training draft
```

The names describe each file's role; use formats your team can read and maintain. Folder names alone do not restrict access or enforce review. Configure sharing separately and test it with the intended readers.

Keep a short source register containing each item's identifier, owner, current review state, and location. When producing an output, add the version used. A small table is enough for three procedures. Avoid copying the entire instruction into the register: its purpose is to help people find and manage the maintained source.

## Metadata Does Not Require Markdown

The metadata from chapter 5 can appear as an ordinary table at the top of a Word document:

| Field | Example value |
| --- | --- |
| Identifier | PROC-001 |
| Owner | Onboarding team |
| Review state | Draft for this exercise |
| Applies to | Fictional onboarding process |

We choose these fields because they help us identify and use the information. The table does not automatically validate its values or prevent someone from changing the status. A reviewer still needs to know which version was inspected and what the decision covers.

Use consistent field names and a small set of agreed statuses. This makes the files easier to scan and provides a starting point for later processing. Even without a schema checker, the team can review the same questions each time.

## Review Parts and Record the Decision

Ask reviewers to focus on the procedure that changed and its effects on other material. Word's tracked changes and comments can support that discussion. The decision should state which content was accepted, who reviewed it, and any remaining actions. Accepting tracked edits and approving a procedure are different decisions.

OneDrive and SharePoint provide file version history that can be used to inspect or restore earlier versions. Availability and retention depend on the environment and its settings; verify them in your training workspace. Follow [Microsoft's version-history guidance](https://support.microsoft.com/en-us/onedrive/restore-a-previous-version-of-a-file-stored-in-onedrive) rather than assuming every edition will remain available indefinitely.

A file's history does not, by itself, identify the coordinated set of files used for a handbook. Record that selection when assembling the output. For an edition that needs to remain reproducible, retain the reviewed sources and output according to the team's retention policy.

For example, a handbook note can identify the access and equipment versions used and explain that contacts remains excluded or included as draft material. The note makes the selection understandable without asking readers to reconstruct it from editing timestamps.

## Give Copilot a Bounded Task

The context principles from chapter 7 still apply. An AI assistant needs the relevant information, the intended audience, and a clear task. Access to a large collection of files is not the same as knowing which versions and decisions matter.

Copilot in Word can use referenced material to help draft content. The available experience depends on subscription or license, organization settings, platform, and app version. Check [Microsoft's Copilot in Word guidance](https://support.microsoft.com/en-gb/word/copilot/draft-and-add-content-with-copilot-in-word) for the environment you use. This chapter does not assume that every OneDrive account includes it.

Prepare a small context package containing the selected access instructions, their identifier and version, and this kind of task:

```text
Audience: new colleagues in a fictional onboarding exercise.
Task: draft a short explanation of how to request access.
Use only the supplied access instructions for process facts.
Explain which information to include and what reference to retain.
Do not invent a portal address, response time, or approval policy.
Identify missing information as questions for the procedure owner.
List the source used so a reviewer can compare the draft with it.
```

Reference the intended document using the supported control in your application. If file referencing is unavailable, use permitted excerpts in an approved tool, or complete the same drafting task manually. Do not assume that placing a file in a folder makes it available to an AI session.

Read the draft alongside the source. Check names, steps, qualifications, and references. Supplying organizational information through context adapts the response to a local need; it does not retrain the model or guarantee that later conversations will use the same information.

## Respect Access and Information Boundaries

Use the organization's approved AI environment and sharing rules. Do not move confidential material to a personal account to make an exercise easier.

Microsoft documents that Microsoft 365 Copilot agents operate within existing data-access boundaries rather than granting additional permissions. That does not make an overly broad sharing arrangement appropriate. Review who can access the sources and who should receive the generated output. See [Microsoft's data and permission guidance](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/data-privacy-security).

An excerpt or summary can reveal information from a restricted source even when it omits the source link. Check the output's audience separately. A training deck for new colleagues may not need the internal notes used to prepare it.

## Reuse Without Creating Competing Masters

In a manual workflow, an author can assemble selected instructions into a handbook and adapt them for a presentation. Record the selection in the [publication brief](../examples/publishing/publication-brief.md), and check the results as described in chapter 11.

When the access procedure changes, use the register to find the handbook and training material that depend on it. Update those outputs and record the check. This is a manual version of following dependencies; it is useful even before the team has an automated builder.

If someone corrects the presentation, decide whether the correction belongs in the source procedure. Keep shared facts there. Keep event-specific examples and layout choices with the presentation. Otherwise, the next author may copy an older instruction and undo the improvement.

## Know When to Add Automation

Start by recording where the work is repetitive or error-prone. Repeatedly assembling the same sections, finding missing owners, or updating several copies of a fact may justify a script or a supported workflow service.

That decision includes ownership. A tool may support extensions while the team lacks permission to configure them. Agree who can change the process, who supports it, and what requires organizational approval. AI can help propose a workflow or write code, but someone still needs to test, maintain, and authorize it.

Do not recreate a complex repository workflow solely to preserve its appearance. A three-document collection may work well with a register and a checklist. A large requirement set with many relationships and publication formats may justify stronger validation and automation.

## Try It: A Portable Onboarding Workflow

Use the fictional [access procedure](../examples/onboarding-showcase/access.md), not real organizational information. The basic exercise needs a document editor and a training folder; OneDrive history and Copilot are extensions to test where available. No Microsoft account changes are required by this repository.

1. Create the folder arrangement shown above in your chosen training workspace. Record the application, account type, and date of the exercise.
2. Put the access instructions into a document in Sources. Include its identifier and a metadata table. Mark this new copy as an exercise draft; do not carry over the original example's approved label as a real decision.
3. Add a source-register entry with its owner, location, and identifiable version. Create a training brief containing the selected instructions and the task above.
4. Draft the explanation manually or with Copilot if available and permitted. Save it in Outputs with a source reference and a draft label. Record which route you used.
5. Make a fictional clarification in the source. Inspect the earlier version through file history if available; otherwise retain a clearly labelled before-and-after exercise copy. Update the register and the explanation.
6. Compare the output with the source and record the review. Check the intended reader's access, using an authorized test account or a colleague where possible; record access checks you could not perform.

**Expected result:** an identifiable source, a reusable context package, a reviewed draft explanation, and a change record showing how one update reached the output.

**If a feature is missing:** distinguish a tool limitation from a permission or licensing issue. Use the manual route for this exercise and record the limitation rather than claiming equivalent automated behavior.

**Keep:** the source register, task brief, review observations, and environment details. These show which practices transferred successfully and which still rely on manual work.

The next chapter, [Automation, Quality, and Further Experiments](13-automation.md), returns to the repository to make repeated checks more reliable and choose the next improvements deliberately.
