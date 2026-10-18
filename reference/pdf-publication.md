# Proposed Chapter: From Markdown to a Designed PDF

Status: optional publication reference linked from chapter 10, not a numbered tutorial chapter. The publishing proof remains under review.

## Purpose

Build a readable, traceable PDF from maintained Markdown and data. Keep text searchable and diagrams sharp. Whole-page SVG export is not part of the workflow.

The small [PDF design trial](../publishing/pdf/README.md) is the first implementation exercise. Its output is a review artifact, not a full book or an approved edition.

## Planned Sections

1. **A PDF Is a Publication, Not a Screenshot.** Introduce continuous reading, selectable text, page layout, and the distinction between vector diagrams and raster photographs.
2. **Choose the Sources and Edition.** Define a publication manifest, chapter order, status policy, and source revision. Parse each chapter's metadata separately. Do not silently omit essential draft material or imply that chapter approval approves the book.
3. **Build with Pandoc and Typst.** Explain the converter, typesetting engine, local dependencies, and reusable template. Keep generated files outside `docs/` and preserve the source of truth.
4. **Design Tables and Information Blocks.** Use native table cells, repeated headers, numeric alignment, units, and deliberate column widths. Show status as text as well as color. Separate visible chapter metadata from PDF title, author, language, and edition metadata.
5. **Prepare Diagrams and Charts.** Render Mermaid to SVG with compatible labels. Regenerate charts from data as vector graphics where practical. Retain captions, alternative text, source revisions, and raster photographs where appropriate.
6. **Replace Interaction with Printable Information.** Render the budget from its source data; replace filters with an explicit selection. Give growth charts a measured revision and provide a link to the website for exploration. Translate example markers into print blocks.
7. **Review and Publish an Edition.** Check every rendered page, links, bookmarks, fonts, heading hierarchy, table pagination, reading order, and accessibility. Retain the exact reviewed PDF with its inputs and tool versions. Automate only after local verification.

## First Exercise

Build the three-excerpt proof. Locate a chapter's status block, inspect the Mermaid diagram at high zoom, copy text from the PDF, and reconcile the budget's 11,000 SEK total variance. Change the template, rebuild, and confirm that the original chapter sources remain unchanged.

Expected result: a PDF whose layout is controlled by the publishing template, whose facts come from maintained sources, and whose provenance distinguishes committed sources from local edits.

## Before Calling the Book Pipeline Complete

- Define whether the deliverable is A4, another paper size, screen-first, or print-ready.
- Test a table longer than one page, a wide table, long code lines, and a large diagram.
- Rewrite Markdown file links into internal book destinations or deliberate external links.
- Decide how draft chapters and release approvals appear in the book.
- Pin redistributable fonts and verify their embedding and licenses.
- Validate accessible reading order and table structure; PDF/UA compliance needs more than successful compilation.
- Record all inputs and template hashes, browser/tool versions, and artifact checksums for releases.
- Add CI checks and downloadable release artifacts without committing generated book files.

## Tool References

- [Pandoc manual](https://pandoc.org/MANUAL.html): Markdown parsing, filters, and Typst output.
- [Typst tables](https://typst.app/docs/reference/model/table/): native cells, headers, and presentation.
- [Typst accessibility](https://typst.app/docs/guides/accessibility/): semantic output and validation considerations.
- [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli): SVG diagram generation.
- [Quarto with Typst](https://quarto.org/docs/output-formats/typst.html): an alternative if coordinated book configuration becomes useful.
