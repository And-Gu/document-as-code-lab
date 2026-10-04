# Contributing

This project is being developed in English.

## Chapter Conventions

Each chapter starts with a stable identifier, a reading-order number, and an explicit status. An outline is not a completed chapter.

Chapter statuses are `outline`, `draft`, `in-review`, `approved`, and the earlier `complete` convention. Use `approved` after the responsible reviewer explicitly accepts the chapter revision; retain that decision with its review or commit record. Chapter approval does not approve the tutorial as a whole or the fictional instructions used in an example. Return substantive revisions to review.

`chapter_number` and the filename prefix must match the current reading order. The `id` is a permanent content key, not a chapter number: older IDs retain prefixes from earlier outlines. For example, `04-markdown.md` has `chapter_number: 4` and `id: 03-markdown`. Do not renumber that ID to fix its apparent mismatch; historical reports use it to recognize the same content. For new chapters, prefer descriptive IDs without a reading-order prefix.

Chapters can store their identifier, `chapter_number`, status, audience, and learning goal in YAML front matter. Filename prefixes and chapter numbers follow the reading order. Preserve existing IDs when renumbering; IDs identify content independently of its position. Keep planning notes out of the reader-facing prose as a chapter develops.

## Visual Specifications

Use a `visuals` list in chapter front matter to record a visual's ID, status, kind, purpose, placement, preferred source format, target outputs, caption, and alternative text. Paths in `source` are relative to the chapter file.

Use `proposed` for a planned visual and `source-ready` when its editable source exists. Source-ready does not mean it has been rendered or verified across output formats. Record the communication need in `kind` and `purpose`, separately from the implementation format in `preferred_source`.

Keep editable diagram files in `assets/diagrams/`. Where a Mermaid diagram is also embedded in Markdown for direct reading on GitHub, keep the code block identical to its source file. This duplication is temporary until the publishing workflow can include source files automatically.

Visual metadata documents intent. Rendering, placement, and accessibility behavior need publishing-tool support; these fields do not implement that support by themselves.

## Writing

Use clear headings, concrete examples, and an exercise with an observable result. Define unfamiliar terms and link to related chapters.

Use the shared definitions in `GLOSSARY.md`. End exercises with an expected result, a focused troubleshooting note, and what readers should retain. Link to authoritative setup guides rather than duplicating installation instructions.

Verify product-specific instructions against official documentation when writing them. Record account or plan requirements where they affect the exercise.

## Source and Outputs

Keep reusable prose in Markdown. Keep editable visual sources and provenance with their assets when assets are introduced.

Treat generated outputs as builds. Changes made in a delivered Word document or presentation need an explicit decision about whether they belong in the shared source or only in that output.

Fixed teaching snapshots may be stored under `assets/figures/` with their input data, source revision, measurement version, and regeneration instructions. Label them as historical examples so readers do not confuse them with live reports.

Generated teaching examples may also be versioned under a named directory such as `assets/onboarding-showcase/`. Keep their editable inputs, generation script, input hashes, and regeneration instructions available. Review and commit changed inputs and outputs together. Update any accompanying tables, captions, and alternative text when the example changes. Label fictional review states clearly; generated output is not evidence of operational approval.

Keep fixed demonstrations separate from learner-editable copies. When examples reuse an illustrative ID, explain which copy a chapter uses and do not imply that approval transfers between them.

## Review

Review factual accuracy, clarity, links, accessibility, and cross-format rendering as relevant to the change.

Update the feature register only when a capability meets its documented completion criterion. Record the change in the same commit as the implementation so that history captures the milestone.
