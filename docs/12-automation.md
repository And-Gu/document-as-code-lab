---
id: 10-automation
chapter_number: 12
status: outline
---

# Automation, Quality, and Further Experiments


## Learning Goal

Make the publishing and measurement workflows repeatable.

## Planned Topics

- Builds on updates to the main branch
- Regenerating assembled text, charts, and selected AI context from maintained sources
- Detecting stale generated assets and disagreement with chapter tables, captions, and alternative text
- Historical metric generation without recursive commits
- Link, source, and rendering checks
- Accessible and reproducible output
- Recording source revisions and build inputs across outputs
- Keeping automated validation separate from human approval and publication decisions
- Future interactive visualizations

## Planned Exercise

In a working copy of the onboarding example, change a procedure's wording and review status. Run a workflow that regenerates the handbook, training excerpt, and chart, and checks their agreement with the sources. Include checks for explanatory tables, captions, and alternative text so they cannot silently retain old values. Deliberately leave one generated output stale and verify that the check fails.

Then update a chapter and verify that the growth report and available published outputs identify the intended source revision. Keep generated build results out of the measured chapter content and avoid workflows that trigger themselves through repeated output commits.

Expected result: a repeatable build with traceable outputs and a visible failure for stale content. Passing these checks does not approve the procedures or the publication.

## Completion Criteria

The chapter explains the planned topics, includes a reproducible exercise, and documents relevant limitations. Product-specific behavior must be verified when the chapter is drafted.
