---
id: 02-project-growth
chapter_number: 3
status: draft
audience: practitioners-learning-data-driven-documentation
learning_goal: Measure project growth from Git revisions and interpret the resulting charts.
visuals:
  - id: growth-history
    status: source-ready
    kind: chart
    purpose: Compare content volume, chapter count, and completed capabilities over revisions.
    placement: after-generate-your-first-report
    preferred_source: matplotlib
    source: ../scripts/measure_growth.py
    generated_asset: ../build/growth/growth.png
    outputs: [web, pdf, slides]
    caption: Three separate measures of project growth, calculated from source revisions.
    alt: Separate panels show prose word count, chapter file count, and completed capabilities by revision. A working-tree preview, when requested, is labelled separately.
  - id: chapter-sizes
    status: source-ready
    kind: chart
    purpose: Compare the sizes of individual chapters in the latest measured snapshot.
    placement: after-generate-your-first-report
    preferred_source: matplotlib
    source: ../scripts/measure_growth.py
    generated_asset: ../build/growth/chapter-sizes.png
    outputs: [web, pdf, slides]
    caption: Prose word counts by chapter, including outline material.
    alt: Horizontal bars compare chapter word counts, identified by stable chapter IDs.
  - id: growth-first-update
    status: source-ready
    kind: chart
    purpose: Compare the initial outline with the first committed set of chapter drafts.
    placement: after-our-first-committed-comparison
    preferred_source: matplotlib
    source: ../scripts/measure_growth.py
    generated_asset: ../assets/figures/growth-first-update/growth.png
    data: ../assets/figures/growth-first-update/history.json
    source_commit: 9c91191bcf0bf77a337870a17f43523d16f7407b
    measurement_version: 2
    outputs: [web, pdf, slides]
    caption: Two committed observations show accumulated change, not a sustained growth rate.
    alt: Prose words rise from 829 to 16416, chapter files from 10 to 12, and recorded completed capabilities remain zero.
---

# Project Growth: History as Data

Project growth is more than a rising word count. We want to know how much of the tutorial has been developed, where its content is concentrated, and which publishing or visualization capabilities actually work. Those questions help us decide what to write, review, or build next.

In a document-as-code project, the source files and their recorded history can supply much of this information. A script can read earlier revisions, apply the same measurement rules to each, and produce data for charts. We do not need to maintain a separate progress spreadsheet by hand.

Chapter 1 demonstrated different views of the same information. Chapter 2 introduced the workspace and its automation. Here, the tutorial itself becomes our dataset: you will inspect a real historical result, learn how it was calculated, and generate a report of your own. Reading the example requires no installation. The local exercise uses Git and Python 3.9 or later.

## What Does Growth Mean?

Our project grows in several ways. We add content, develop chapters, and introduce capabilities such as PDF publishing. These changes need different measures.

| Measure | What it describes | What it does not establish |
| --- | --- | --- |
| Chapter files | Scope of the tutorial, including outlines | How many chapters are ready to use |
| Draft or complete chapters | Material that has progressed beyond an outline | Independent verification of its quality |
| Prose words | Approximate volume of readable content | Clarity, correctness, or usefulness |
| Completed capabilities | Features explicitly marked complete | The amount of code or effort invested |

A shorter explanation may be an improvement. A chapter can become more useful without gaining words, and a new publishing capability may add no prose at all. We will look at these measures together and inspect the changes behind them.

Chapter 1's dashboard summarizes fictional procedure review states. This report measures the tutorial repository. A chapter marked `draft`, a procedure marked `approved`, and a capability marked `complete` describe different things; they should not be combined into one completion percentage.

## Our First Committed Comparison

The first commit, `8908932`, contains ten chapter outlines. The next, `9c91191`, records the first seven drafts, supporting examples, and processing scripts. Compare these actual revisions using the same measurement rules:

![Prose words increase from 829 to 16416 and chapter files from 10 to 12. Recorded completed capabilities remain zero across the two revisions.](../assets/figures/growth-first-update/growth.png)

*Two committed observations, ending at `9c91191`, measured with rules version 2. This is a fixed historical comparison, not a live report.*

| Measure | Initial outline: 8908932 | First drafts: 9c91191 | Change |
| --- | --- | --- | --- |
| Chapter files | 10 | 12 | +2 |
| Draft or complete chapters | 0 | 7 | +7 |
| Prose words | 829 | 16,416 | +15,587 |
| Recorded completed capabilities | 0 | 0 | No change |

The additional chapters cover the GitHub workspace and structured content. Existing chapters were expanded and reordered; their stable IDs preserve their identity across that reorganization. Seven chapters are drafts, not seven approved or completed publications.

The flat capability line needs explanation. The commit includes working scripts and tests, but the feature register still records every capability as planned. This metric reports explicit milestone decisions, not an automatic assessment of available functionality. The appropriate next action is to review the completion criteria and evidence, then update the register where justified, rather than interpret zero as "nothing works."

The large word-count increase represents work accumulated before one commit. Git does not record each uncommitted editing step. These two points establish a before-and-after comparison, not a reliable trend, productivity rate, or forecast.

The [chapter-size chart](../assets/figures/growth-first-update/chapter-sizes.png) shows another useful detail: structured content is the largest chapter at this revision, with 3,063 measured words. That suggests a readability review, not an automatic decision to shorten it. Its examples may justify the space.

The [saved report](../assets/figures/growth-first-update/history.json) contains both observations and their chapter-level values. This chapter update is not included in the totals above: the report is pinned to the earlier committed source. Recreate the snapshot from the repository root with:

```bash
python scripts/measure_growth.py --ref 9c91191bcf0bf77a337870a17f43523d16f7407b --output build/first-update-check
```

With the same script and measurement rules, the JSON values should match the saved report. Keep future live reports separate from this teaching snapshot. The original one-observation [baseline chart](../assets/figures/growth-baseline.png) and [data](../assets/figures/growth-baseline.json) remain available as historical assets.

## Choose a View for the Question

The report separates measures with different units rather than combining them into a single score. Each view should help a reader ask a specific question:

| Question | Useful view | What to inspect before acting |
| --- | --- | --- |
| How has the content changed? | Word count by revision | The edits behind a rise or fall |
| Has the scope expanded? | Chapter count by revision | Whether files are outlines, drafts, or completed chapters |
| Where is the material concentrated? | Horizontal bars of chapter sizes | Whether longer chapters need their detail or should be split |
| What can the project deliver? | Completed capabilities by revision | Each capability's completion criterion and supporting evidence |

For example, splitting one chapter into two can increase the chapter count without adding much information. Editing for clarity can reduce the word count. Neither change is automatically progress or a setback. Use the chart to find a change worth inspecting, then read the source and its review context.

The history chart uses separate panels for words, chapters, and capabilities. The chapter-size chart uses horizontal bars so chapter identifiers remain readable. Both are generated from the same report, which could also supply a website dashboard or a presentation later.

## Git History Is Our First Dataset

Git records revisions of the source files. Each commit has an identifier, a date, and a snapshot of the repository. We can read those snapshots to reconstruct earlier chapter counts and word counts, even if the measurement script was added later.

The script uses the first-parent history of the selected revision. This follows the main sequence of revisions and, after a merge, measures the merged result rather than every separate branch commit. The charts use revision order; they do not imply equal time between commits. Dates remain available in the report.

A commit is a recorded observation, not a unit of effort. Several days of work may appear in one commit, while a small correction may have its own. Do not use the slope of this revision-based chart as a measure of productivity per day or as a comparison between authors.

Git and GitHub contribute different information. This exercise reads Git history from a local clone. In GitHub Actions, that clone is fetched from GitHub. Issues, pull requests, and project fields require additional GitHub data; collecting those is a later dashboard exercise.

## Define the Rules Before Counting

The script counts chapter files directly inside `docs/`, including outlines. It measures their prose while excluding metadata and fenced examples, and leaves supporting files and generated outputs outside the totals. This is a measure of content volume, not a precise estimate of reading effort.

The report records `measurement_version: 2`. Use the same rules across revisions; otherwise a change in measurement can look like a change in content. The optional [measurement reference](../reference/growth-measurement.md) lists exact inclusions, exclusions, and regeneration commands.

## Track Capabilities Explicitly

The [feature register](../data/features.json) lists capabilities and their completion criteria. Supported statuses are `planned`, `in-progress`, and `complete`.

Only `complete` contributes to the completed-capability count. A person must check the criterion before changing that status. Adding a file or setting a field does not prove the capability works.

For example, the PDF book capability requires the book to be generated from source and visually verified. Writing a publishing script alone does not meet that criterion. The register records a checked milestone rather than guessing functionality from the number of scripts in the repository.

The report reads the register at each revision. If no register exists, the capability count is unknown rather than zero. It cannot reconstruct milestones that were never recorded. You can document an earlier milestone explicitly, but should distinguish that retrospective entry from what Git recorded at the time.

## Generate Your First Report

Use a local clone with Git history. If you need help obtaining it, follow [GitHub's setup guide](https://docs.github.com/en/get-started/git-basics/set-up-git) and [cloning guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository). The repository root is the top-level folder containing `README.md`, `requirements.txt`, and `scripts/`.

The commands below use a macOS/Linux shell. For Windows commands and environment activation, follow [Python's virtual environment guide](https://docs.python.org/3/library/venv.html). Once the environment is active, the `python` commands for the exercises are the same. An agentic tool working in the clone can also run the exercise; ask it to report the source revision, outputs, and any failures.

From the repository root, create an isolated Python environment and install the measurement dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python scripts/measure_growth.py
```

The script creates three files in `build/growth/`:

| File | Contents |
| --- | --- |
| `history.json` | Source commit, date, chapter records, and capability data for each revision |
| `growth.png` | Separate historical panels for words, chapter files, and completed capabilities |
| `chapter-sizes.png` | Word counts for individual chapters in the latest snapshot |

These are generated outputs and are excluded from version control. You can regenerate them from the source. The JSON report is also a future input for an interactive website dashboard.

The default report ends at `HEAD`, your current committed revision. Uncommitted edits are excluded. To inspect local edits without presenting them as history, run:

```bash
python scripts/measure_growth.py --include-working-tree
```

This adds a separately labelled working-tree snapshot. Its `source_commit` identifies the base revision, not an exact version of the local edits. Keep the committed report for reproducible comparisons.

Open both generated charts and compare them with `history.json`. Chapter statuses are available in the data but are not a separate panel in the history chart. The chapter-size chart shows the latest measured snapshot, including the working-tree preview when requested. Its stable chapter IDs may retain older number prefixes after chapters are reordered; use the report's titles and paths to identify them.

### Optional: Ask AI to Interpret the Report

The structured report is also useful context for an LLM. An agent can help explain a change, suggest a visualization, or adapt the measurement script. Give it the rules and source revisions as well as the numbers, so it can distinguish observations from interpretations.

After generating a report, try a bounded request:

```text
Read build/growth/history.json and the measurement rules in
docs/03-project-growth.md. Compare the last two committed observations.
If fewer than two exist, say that a trend cannot yet be established.
Report the source commit IDs and changes in words, chapters, and
completed capabilities. Keep any working-tree preview separate.
Distinguish measured facts from possible explanations.
Suggest one source change to inspect before drawing a conclusion.
Do not edit files or change completion statuses.
```

Check its figures against the JSON report. A plausible explanation is not evidence of why something changed. If you ask an agent to modify the counting rules, review the code and tests, update the measurement version, and regenerate comparable history. [Chapter 6](06-ai-native.md) develops this approach to context and verification.

## Try It: Compare Two Revisions

Use your own working copy so you can make an experimental commit.

Before editing, predict the result: adding a paragraph to an existing chapter should change its word count, but not the number of chapters or completed capabilities. If you completed chapter 2's optional editing extension and its change was accepted, you can skip steps 2 and 3 and investigate that edit instead.

1. Run the script and note the latest totals in `build/growth/history.json`.
2. Add a useful paragraph to a chapter. Generate a working-tree preview and inspect the change in its word count.
3. Commit the paragraph with a message explaining its purpose.
4. Run the default script again. Compare the final two entries in `history.json` and inspect both charts.
5. Explain whether the change affected words, chapter count, or capabilities, and whether it improved the tutorial.

For an optional reproducibility check, regenerate the same revision using the commands in the [measurement reference](../reference/growth-measurement.md). A shallow clone lacks the history this exercise needs; the script stops rather than silently reporting incomplete totals.

**Expected result:** the new committed observation reflects your paragraph, with chapter and capability counts unchanged. Its exact word change depends on the text you wrote.

**If totals do not change:** check whether the edit is committed or whether you requested the working-tree preview. Edits under `examples/` are intentionally excluded. For a missing dependency, check that the Python environment is active and the requirements installation succeeded.

**Keep:** the intended chapter edit, its explanatory commit, and a short interpretation stating what changed, what the measures cannot establish, and what you would inspect next. Keep generated reports under the ignored `build/` directory; the shared-source revision is what lets you recreate them.

For the information item you identified in chapter 1, choose one question a report could answer. Name the source field or history needed, the view you would use, and a decision it would support. A procedure collection might need a count of items awaiting review rather than a word-count chart.

## Update the Report on GitHub

The [growth workflow](../.github/workflows/growth.yml) is configured to run on pushes to `main` and manual dispatch. It checks out the full history, installs dependencies, runs focused tests, and uploads the JSON report and charts as an artifact named `project-growth`.

Full history is requested with `fetch-depth: 0`. [The checkout documentation explains this setting](https://github.com/actions/checkout). The uploaded files can be downloaded from the workflow run; artifacts have retention limits and do not replace the source history. [GitHub documents workflow artifacts](https://docs.github.com/en/enterprise-cloud%40latest/actions/tutorials/store-and-share-data).

The workflow does not commit generated reports back into the repository, so its output cannot trigger a cycle of new commits and builds. It does not yet publish a website or refresh README images. Those integrations belong to the later dashboard and publishing chapters.

Local measurement and a successful GitHub workflow run are separate checks. The [first hosted run for 9c91191](https://github.com/And-Gu/document-as-code-lab/actions/runs/37135502115) completed successfully after the push to `main`, running the tests and uploading the `project-growth` artifact. Repository access is required to inspect this private run, and artifact availability is subject to retention limits. The fixed comparison above remains available with the tutorial's source files.

The downloaded artifact's JSON report matches the locally regenerated report for that revision. This verifies agreement for these inputs, not the correctness of every future measurement or an automatic completion decision for the feature register.

Next, [Markdown and Content Structure](04-markdown.md) explores the source conventions that make these chapters easier to maintain and process.
