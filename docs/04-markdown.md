---
id: 03-markdown
chapter_number: 4
status: in-review
learning_goal: "Read and edit common Markdown structures and explain why plain-text sources are useful."
---

# Markdown: Readable Sources

Suppose you need to add a step to the access procedure. With Markdown, you can edit the words and formatting markers in a readable text file, then see how they appear on the page.

**Markdown** is a lightweight format for plain text. A renderer turns its markers into headings, lists, links, and tables. We use it here because people and tools can inspect and update the source without opening a particular word processor. Document-as-Code can use other formats too.

Many of us create and revise Markdown through an interactive AI chat, describing what we want rather than typing every formatting marker ourselves.

## Source and presentation

The access procedure from our fictional onboarding example starts like this:

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

Add one step and compare the source with its preview. The browser practice below lets you see the effect without editing the repository.

<!-- interactive: markdown-playground -->

**Self-check:** Add a fourth numbered step, then add a link to an imaginary support page using `[Support](https://example.com/support)`. Change a value in the example table and check the preview. Don't worry, this playground does not grade your edits or save them into the repository.

The markers below control the structure you see in the preview. Italics use `*text*`, while bold uses `**text**`:

| Element | Source syntax |
| --- | --- |
| Title | `# Title` |
| Section | `## Section` |
| Italics | `*text*` |
| Bold | `**text**` |
| Link | `[label](url)` |
| List item | `1. Step` or `- Item` |

### Tables

Use a pipe character (`|`) to separate columns. The first row contains the column headings; the next row uses dashes to separate those headings from the data:

```markdown
| Field | Example |
| --- | --- |
| Team | Engineering |
| System | Project workspace |
```

Each following line adds a row. You can edit this table in the playground and see the result beside the source.

### Inline code and code blocks

Use **inline code** for a short literal value within a sentence, such as a filename. Put one backtick before and after it: writing \`access.md\` displays `access.md`.

A **fenced code block** displays several lines exactly as written, rather than treating them as ordinary Markdown. Put three backticks on a line before the example and three more on a line after it:

````markdown
```bash
echo "Hello"
```
````

The optional label after the opening backticks names the language: `bash` for shell commands, or `markdown` for Markdown source. A renderer can use it to color the syntax. The block above displays a command; it does not run it.

To inspect an actual file, open the [draft access procedure](../examples/onboarding/requesting-access.md), which is separate from the approved showcase copy. [GitHub's illustrated guide](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#disabling-markdown-rendering) explains how to switch between source and preview.

## Why is this useful?

Plain-text files are straightforward to compare in version control. They also work well with scripts and AI tools because the content is directly accessible. Small changes are usually easy to inspect in a diff.

This does not mean every kind of information belongs in Markdown. Detailed CAD models, binary media, and large structured datasets may need other formats.

Applications can also expose data through documented file formats or exports, often using [JSON (JavaScript Object Notation)](https://www.json.org/). These let scripts and AI agents read and process the data without using the application's interface. Check that the format preserves the information you need and is supported by the tools you want to use.

### Optional: other readable source formats

Markdown is one choice among several. The publishing tools and contributors' needs help determine which format fits.

| Format | Useful when | Consider |
| --- | --- | --- |
| Markdown | Readable prose and common headings, lists, and tables are enough. | Extensions and rendering differ between tools. |
| [MDX](https://mdxjs.com/docs/what-is-mdx/) | Markdown needs embedded JSX components. | It requires a compatible build and introduces executable code. |
| [AsciiDoc](https://docs.asciidoctor.org/) | Technical publications need richer document features. | Use a processor that supports its syntax and output requirements. |
| [reStructuredText](https://docutils.sourceforge.io/rst.html) | Structured technical documentation benefits from directives and references. | Contributor familiarity and the chosen publishing tool matter. |

This project keeps chapters in Markdown and adds interactive components through Astro. You do not need to adopt another format to follow the tutorial.

## Markdown is not a full information model

Headings and paragraphs describe how content reads. They do not, on their own, tell software which team owns a procedure, whether it is approved, or how it depends on another activity.

The playground shows how readable source becomes a formatted page. To find procedures by owner or review state, software needs information beyond headings and paragraphs. [Chapter 5](05-structured-content.md) adds those structured fields alongside the instructions.

<!-- interactive: chapter-quiz -->
