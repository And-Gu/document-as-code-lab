---
id: 10-automation
chapter_number: 12
status: draft
audience: practitioners-maintaining-repeatable-document-workflows
learning_goal: Run and inspect repeatable checks, detect stale outputs, and distinguish automated evidence from publication decisions.
---

# Automation, Quality, and Further Experiments


Throughout this tutorial, we have changed a maintained source and followed its effects into other views. Doing that once demonstrates reuse. Doing it reliably after every relevant change requires a repeatable process.

Automation helps with the steps that are easy to forget: checking records, rebuilding a chart, selecting current instructions, or retaining evidence of a run. It also gives the team a process it can inspect and improve rather than a sequence that exists only in someone's memory.

This final chapter brings the existing scripts together, examines what the hosted workflow actually checks, and introduces a deliberate stale-output experiment. It closes with ways to develop the project as both a tutorial and a visualization showcase.

## Turn a Repeated Task into a Workflow

A workflow describes when work begins, which steps run, and what happens if a step fails. The runner is the machine executing those steps. Both terms appeared in chapter 2; here we use them to connect the individual exercises.

For a publishing workflow, a sensible sequence is to validate the sources, generate the selected outputs, check those outputs, and retain the results for review. Stop before delivery when a required check fails. The exact checks depend on the publication and the consequences of an error.

| Stage | Example check | Evidence to retain |
| --- | --- | --- |
| Validate | Required fields and record references are valid | Check result and useful error messages |
| Generate | Selected sources produce the expected files | Output list and input identifiers |
| Compare | A saved output agrees with a fresh build | Difference report |
| Inspect | Text, links, tables, and images work for readers | Review notes for the actual output |
| Deliver | The reviewed edition reaches the intended audience | Publication location and edition identifier |

A passing automated check answers a defined question. It cannot tell us that an instruction is useful merely because its metadata is valid. Keep the human decisions from chapter 8 visible in the workflow.

## What This Project Already Runs

The [growth workflow](../.github/workflows/growth.yml) runs on pushes to `main` and can also be started manually. It retrieves the repository history, prepares Python, installs the declared dependencies, runs the tests, and generates growth reports. It then uploads the JSON data and charts as a downloadable artifact.

The workflow has read-only repository-content permission and does not commit generated reports back into the source. It measures recorded revisions, so a local uncommitted edit is not part of the hosted report. Chapter 3 explains how to include working-copy measurements explicitly when exploring changes locally.

Other useful scripts are available, but they are not all steps in that hosted workflow:

| Script | What it does | Default output |
| --- | --- | --- |
| `scripts/measure_growth.py` | Measures chapter and capability history | `build/growth/` |
| `scripts/process_records.py` | Validates records and builds three text views | `build/records/` |
| `scripts/build_record_diagram.py` | Generates Mermaid source from record relationships | `build/record-diagram/` |
| `scripts/build_onboarding_showcase.py` | Rebuilds the fixed onboarding teaching example | `assets/onboarding-showcase/` |

The last script deliberately writes tracked teaching assets. Run it only when you intend to inspect and update those examples, or use a disposable project copy. The other outputs are local build results ignored by Git.

The growth workflow produces report artifacts. A separate Astro pull-request workflow checks the website build, and the Pages deployment workflow builds and publishes the website after changes reach `main`. That build also regenerates the data for chapter 3's interactive growth widget. Book generation, procedure approval, and checks of every chapter caption are outside these workflows. Knowing these boundaries helps us decide what to add next.

## Check More Than the Build Result

Different failures need different checks. A record can pass validation but contain an incorrect instruction. A chart can reflect its data correctly while the paragraph below it still quotes an older count.

Source checks should cover fields, references, and selection rules. Output checks should cover expected files, content, links, and visual presentation. Tests should include a small known example with an expected result, so a consistent but incorrect generator does not pass merely because it ran twice.

For the onboarding showcase, think through the effects of two changes:

- A wording change in access should reach the handbook and training excerpt. The status count can remain unchanged.
- A status change in contacts should affect the data, chart, and handbook status label. The explanatory table, caption, and alternative text in chapter 1 also need attention.

The current builder does not rewrite that surrounding chapter prose. Either maintain it as an explicit review task or extend the publishing process to derive repeated values from the same data. An agent can find likely references and propose updates, but its report should identify what it checked and what it could not verify.

## Detect Stale Outputs

An output is stale when it no longer represents the inputs it is supposed to reflect. A file can look plausible and still be stale, which is why visual inspection alone is not enough.

One practical check is to build the expected result into a fresh location and compare it with the saved output. Differences reveal that something changed. They do not, by themselves, establish which version is correct; inspect the source and build settings before replacing anything.

Compare like with like. Timestamps, tool versions, or font changes can alter generated files even when the meaning is unchanged. For text outputs, a direct difference is often useful. For rendered documents, combine content checks, recorded dependencies, and visual review. A reproducible build aims to reproduce the expected result from identified inputs, with any unavoidable variation understood.

The record processor writes a manifest containing input hashes. A hash is a fingerprint of file contents: it helps identify whether those contents changed. A hash does not prove correctness or approval, but it is useful when distinguishing local edits from a recorded source revision.

## Keep Failures Visible and Recoverable

Do not replace a working publication with a partial output when a build fails. Keep the previous release available, identify it clearly, and report that the new candidate did not pass. The person responsible needs the failed step, the source version, and enough detail to investigate.

Retained workflow artifacts are useful evidence, but they are subject to retention settings. A long-lived publication or required review record needs an appropriate storage and retention decision. [GitHub's Actions settings guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository) describes artifact and log retention controls.

Test recovery as well as success. Can another maintainer rebuild the output? Can the team identify the source of the previous release? Can it stop or reverse delivery when the wrong edition is published? These questions become more important as the tutorial grows into a platform that others depend on.

## Give Automation Only the Access It Needs

A measurement job needs to read source information and retain results. It does not normally need permission to edit source files or publish to an external service. Separate those responsibilities when designing later workflows.

Treat contributions and retrieved content as inputs to inspect, not instructions that may redefine the workflow's permissions. Keep credentials out of source files and generated reports. Review dependency and workflow changes with the same care as other code changes. [GitHub's token guidance](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token) explains how workflow permissions can be limited.

Publishing and privileged operations deserve explicit conditions. An agent that prepares a draft or fixes a failed link should not acquire permission to release the entire website merely because it can edit a workflow file.

The current growth workflow avoids output-commit loops by uploading results instead of pushing them into the repository. Preserve that separation unless there is a clear reason to change it. When a later process writes generated files back, design and test its triggers so its own updates do not create repeated builds.

## Try It: Make a Stale View Fail a Check

Use the Python environment from chapter 3. This exercise uses the existing structured-record processor and fresh output directories. Keep any files you want to retain elsewhere before reusing these directory names.

First run the tests and generate two views from identical inputs:

```bash
python -m unittest discover -s tests
python scripts/process_records.py --output build/automation-saved
python scripts/process_records.py --output build/automation-fresh
git diff --no-index --exit-code build/automation-saved build/automation-fresh
```

The comparison should show no differences and return exit code 0. Both runs use the same working files and generator.

Now open `build/automation-saved/dashboard.md` and deliberately change one numeric count to `99`. This simulates an incorrect or stale saved view without changing the maintained records. Repeat the comparison:

```bash
git diff --no-index --exit-code build/automation-saved build/automation-fresh
```

This time it should display the changed count and return exit code 1. That nonzero result is how a workflow could stop rather than accept the saved view. For this experiment, it is the expected result.

Regenerate the saved set from the unchanged sources and compare once more:

```bash
python scripts/process_records.py --output build/automation-saved
git diff --no-index --exit-code build/automation-saved build/automation-fresh
```

The comparison should return to exit code 0. In a disposable project copy, you can also change a record and rebuild only the fresh set. The comparison should then expose the old saved view and its outdated input manifest.

**Expected result:** a clean comparison, a deliberate failure with a visible difference, and a clean comparison after rebuilding. You have tested detection, not just successful generation.

**If the result differs:** inspect both output directories and confirm that they were built from the same sources. A new commit or generator change also changes provenance. Do not remove those differences merely to make the check pass; determine whether they explain a genuinely different build.

**Keep:** a short note describing the deliberate fault, the observed failure, and the correction. Generated outputs remain under ignored `build/` directories.

### Extend It: Check the Whole Change

In a disposable project copy, repeat chapter 10's onboarding change and also change the contacts status. Run the showcase builder. Inspect the handbook, excerpt, data, and chart against the sources, then find the related table, caption, and alternative text in chapter 1. Record which values still need editing. This deliberately demonstrates the gap between generated assets and manually maintained explanations.

Next, run `python scripts/measure_growth.py --include-working-tree` after a chapter edit. Inspect the working-copy observation as described in chapter 3 and distinguish it from committed history. Keep generated outputs outside `docs/` so they do not become additional chapter content in the measurement.

Turning these exercises into one hosted quality workflow is a next implementation step. Add focused checks, test an intentional failure, and review the workflow before enabling it. The current growth workflow remains unchanged by this chapter.

## Choose the Next Experiment

The project now has a complete first draft of the tutorial, but the showcase can continue to develop. Choose the next experiment by the question it helps answer and the evidence needed to call it useful.

| Experiment | What it would teach | Evidence of success |
| --- | --- | --- |
| Interactive growth dashboard | Filtering and comparing history | Values match the measured revisions and controls work accessibly |
| Connected work overview | Joining content and task data | Every displayed item links to its source and observation time |
| Website, book, and presentation builds | Audience-specific publishing | A source change reaches all intended outputs and each passes visual review |
| Dependency-aware updates | Coordinating related text and visuals | Changed and unchanged outputs are accounted for, including captions |
| Portable team workflow | Adapting the practices outside GitHub | Another person can follow the recorded procedure in the stated environment |

Use the [feature register](../data/features.json) to record capability progress only when its criteria are met. A written chapter, a promising demonstration, and a verified capability are different milestones.

## Bring It Back to Your Own Work

Return to the information item you chose in chapter 1. You can now describe its owner, source, metadata, review process, useful views, AI context, and publication needs. Choose one repeated step to improve and one check that would make the result more trustworthy.

Document-as-code is not a requirement to replace every familiar application. It is a way to make information and the processes around it easier to inspect, reuse, and develop. Start with a manageable improvement, learn from the people using it, and let the tools grow with the work.
