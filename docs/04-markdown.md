---
id: 03-markdown
chapter_number: 4
status: draft
audience: practitioners-new-to-markdown
learning_goal: Write a clear Markdown procedure with headings, lists, and links, and check its formatted preview.
---

# Markdown and Content Structure

Markdown is a simple way to write structured documents using plain text. Instead of manually formatting headings, lists, and links, you describe their purpose using a few symbols.

This makes Markdown easy to read, edit, and process with tools. The same document can be displayed on GitHub, published as a website, or used as input to an AI assistant.

In this chapter, you will learn the Markdown elements needed to create clear, structured documents.

## Structure, Not Appearance

In a Word document, you might select a line and apply a heading style. In Markdown, you write:

```markdown
## Requesting Access
```

The `##` identifies a second-level heading. A renderer, such as GitHub or our Astro website, decides how that heading looks.

This distinction is important: **Markdown describes the structure of information, not its visual design.**

Well-structured content is easier to navigate, review, reuse, and process automatically.

## A Markdown Document

Let's continue with the onboarding example from earlier chapters. A new colleague needs instructions for requesting access to a system.

Here is a shortened teaching version of the procedure:

```markdown
# Requesting Access

Follow these steps to request system access.

## Before You Start

Have the following information ready:

- Your team name
- The system you need access to

## Submit Your Request

1. Open the service portal.
2. Select the system.
3. Enter your team name.
4. Submit the request.

## Follow Up

Keep the confirmation reference number.
Use it when contacting the service desk.

See [the onboarding overview](../onboarding-showcase/README.md)
for more about this fictional example.
```

*This is a fictional teaching example, not a replacement for the exercise file. Confirm the instructions before using them at work.*

Even without formatting, the document is easy to follow.

The title identifies its purpose, headings divide the instructions into meaningful sections, and numbered steps show what to do in sequence.

A tool can recognize these same structures when preparing a website, extracting instructions, or selecting information for an AI task.

## The Markdown Elements You Need

Most everyday documentation uses only a few Markdown elements.

| Element | Markdown syntax |
|---|---|
| Document title | `# Title` |
| Section heading | `## Section` |
| Subsection | `### Subsection` |
| Bold text | `**Important**` |
| Bullet list | `- Item` |
| Numbered list | `1. First step` |
| Link | `[Link text](file.md)` |
| Image | `![Description](image.png)` |
| Inline code | `` `filename.md` `` |

A few additional conventions are useful:

- **Paragraphs:** Separate paragraphs with a blank line.
- **Tables:** Use `|` to separate columns and a row of `---` entries to separate headings from data.
- **Code blocks:** Put three backticks on separate lines before and after code or other literal text. Unlike inline code, a fenced block stands on its own and can contain several lines. An optional language label helps the renderer highlight the syntax.

For example, a Markdown table is written as:

```markdown
| Item | Status |
| --- | --- |
| Access request | Submitted |
| Approval | Pending |
```

Inline code stays within a sentence, for example: Open `requesting-access.md`. A fenced block is used for the complete Markdown and table examples above. Language labels such as `markdown`, `yaml`, and `bash` identify Markdown source, structured data, and shell commands entered in a terminal. A label does not run the contents.

Use descriptive headings and links. Prefer "Request System Access" over "Information" and "Read the onboarding guide" over "Click here".

For longer documents, use one `#` heading for the title and organize sections with `##` and `###`.

These simple conventions make documents easier for both people and tools to understand.

## Source and Preview

Markdown exists as plain text, but readers often see a formatted version.

Open [Requesting Access on GitHub](https://github.com/And-Gu/document-as-code-lab/blob/main/examples/onboarding/requesting-access.md). At the top of the file, switch between:

- **Code:** The original file, including Markdown symbols.
- **Preview:** The rendered document, with headings, lists, tables, and links.

Our Astro website also renders Markdown. Its appearance can differ from GitHub because it uses its own layout and styling.

The source remains the same; only the presentation changes. You are not editing the file by switching views. [GitHub's illustrated guide](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#disabling-markdown-rendering) shows the Code control.

Not every Markdown feature works identically in every tool. GitHub supports GitHub Flavored Markdown, including tables and task lists. Other publishing tools may support additional features or interpret them differently.

**Always check the result in the environment where readers will use it.**

## Try It: Improve the Access Procedure

Open the [draft access procedure](../examples/onboarding/requesting-access.md) and work in your own editable copy. This is separate from chapter 1's fixed showcase; leave that demonstration unchanged.

1. Read the Markdown source and its formatted preview.
2. Add a section called `## If You Need Help`.
3. Write two or three sentences explaining how a colleague should seek assistance. If the process is unknown, clearly mark it for confirmation rather than inventing instructions.
4. Add a link labelled `Contribution guidance for maintainers`, using `../../CONTRIBUTING.md` as the destination. This path is relative to the exercise file.
5. Check the preview. Are the headings, text, and link easy to understand?

**Expected result:** A short, readable Markdown procedure with a clear structure, a new section, and a working link. Leave any existing metadata unchanged; chapter 5 explains those fields.

**If the preview looks wrong:** Check heading markers, blank lines, and balanced code fences. Resolve link paths from the file containing the link, not from the repository root.

**Keep:** The revised exercise file. Recording and reviewing changes in Git is covered in chapter 9.

You can make these changes in a text editor or ask an AI assistant to help. In either case, inspect the resulting file and verify the instructions.

## What Comes Next?

You can now create readable, structured content using Markdown.

In [Chapter 5: Templates and Metadata](05-structured-content.md), we add consistent fields such as IDs, owners, and statuses. This allows tools to find, validate, and organize information more reliably.

Later chapters explore diagrams, collaboration, automation, and publishing the same information in different forms.
