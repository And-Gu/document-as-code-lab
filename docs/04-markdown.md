---
id: 03-markdown
chapter_number: 4
status: in-review
learning_goal: "Read and edit common Markdown structures and explain why plain-text sources are useful."
---

# Markdown: Readable Sources

Markdown is a lightweight way to format plain text. A Markdown file stays readable in a text editor, while a renderer can present it with headings, lists, links, tables, and other formatting.

We use Markdown for this tutorial because people and tools can inspect and update the source without opening a specific word processor. Markdown is a useful choice, not a requirement of Document-as-Code.

## Source and presentation

Here is an excerpt from our fictional onboarding procedure:

```markdown
# Requesting System Access

To request access:

1. Open the service portal.
2. Select the system you need.
3. Save the request reference.

For questions, contact the **IT support team**.
```

The source is easy to read. A renderer displays it as a heading, a numbered list, and an emphasized team name. The information remains in the text file; the formatting is a view of it.

## Try it in the Markdown Playground

<!-- interactive: markdown-playground -->

**Self-check:** Add a fourth numbered step, then add a link to an imaginary support page using `[Support](https://example.com/support)`. Check the rendered result; this playground does not grade the edits or save them into the repository.

Experiment with a heading (`#`), emphasis (`**text**`), a link (`[label](url)`), and a list. Italics use `*text*`, while bold uses `**text**`. The preview helps you see what changes and what stays in the source.

| Element | Source syntax |
| --- | --- |
| Title | `# Title` |
| Section | `## Section` |
| Italics | `*text*` |
| Bold | `**text**` |
| Link | `[label](url)` |
| List item | `1. Step` or `- Item` |

Tables use pipes between columns and a separator row such as `| --- | --- |` below the headings. Inline code uses single backticks; multi-line literal examples use three backticks on separate lines. Labels such as `markdown` or `bash` describe the contents of a code block; they do not execute it.

For a separate file exercise, open the [draft access procedure](../examples/onboarding/requesting-access.md). It is not the fixed approved showcase copy. [GitHub's illustrated guide](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#disabling-markdown-rendering) explains its source and preview controls.

## Why is this useful?

Plain-text files are straightforward to compare in version control. They also work well with scripts and AI tools because the content is directly accessible. Small changes are usually easy to inspect in a diff.

This does not mean every kind of information belongs in Markdown. Detailed CAD models, binary media, and large structured datasets may need other formats. The important point is to choose sources that suit the information and remain maintainable.

## Markdown is not a full information model

Headings and paragraphs describe how content reads. They do not, on their own, tell software which team owns a procedure, whether it is approved, or how it depends on another activity.

For those questions, we introduce structured fields in [chapter 5](05-structured-content.md). A Markdown file can contain both readable instructions and structured metadata.

## What to remember

**Markdown makes formatted information easy to read and edit at the source.** Its real value in this tutorial is not the syntax itself, but how readable source files support collaboration, review, and processing.

<!-- interactive: chapter-quiz -->
