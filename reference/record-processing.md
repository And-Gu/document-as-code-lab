# Record Processing: Experiments and Traceability

This runnable requirement example complements [chapter 5](../docs/05-structured-content.md) and [chapter 7](../docs/07-processing.md). It uses requirements, tasks, and tests for the same fictional service, not employee readiness records. Work in your own exercise copy.

## Templates and Requirements

## From Documents to Records

Chapter 4 used an onboarding procedure explaining how someone requests system access.

One instruction was to keep the confirmation reference number.

For this fictional service, we express the corresponding expectation as a requirement: it must provide that number.

Our existing [REQ-014 record](../examples/structured-content/records/REQ-014.md) stores that requirement as a separate Markdown file. Its approved status illustrates a fictional review decision; new records start as proposed:

```markdown
---
id: REQ-014
type: requirement
status: approved
owner: onboarding-team
title: Access Confirmation
verified_by: [TEST-008]
---

The access service must confirm a submitted
request with a reference number.

## Rationale

The requester needs a reference when
asking about progress.
```

This is a **structured record**: a readable document with a consistent identity and metadata.

The text describes what the service must do. The metadata describes the record so that people and tools can organize it.

For example, a program could select every record with `type: requirement` and `status: approved`.

## Understanding YAML Metadata

The information between the two `---` lines is called *YAML front matter*.

[YAML](https://yaml.org/spec/1.2.2/#chapter-2-language-overview) is a text format for representing structured information. In this example, each field has a name and a value. Front matter describes the file as a whole; the prose follows it.

| Field | Purpose |
|---|---|
| `id` | Unique, stable identifier |
| `type` | Kind of record |
| `status` | Current lifecycle state |
| `owner` | Responsible team or person |
| `title` | Human-readable name |
| `verified_by` | References to related test records |

The notation is straightforward:

- `status: approved` assigns a value to a field.
- `verified_by: [TEST-008]` contains a list with one item.
- `verified_by: []` represents an empty list.

Use spaces, not tabs, for indentation when grouping fields or writing lists. Indentation affects the structure.

The metadata fields are conventions chosen by our project. YAML provides the syntax but does not define what `approved` or `verified_by` means.

A record's status also needs careful interpretation. An approved requirement means that the requirement has been accepted; it does not mean the system has been implemented or tested.

## Templates and Schemas

How do we ensure that different authors create records in a consistent way?

We use two complementary mechanisms.

| Aspect | Template | Schema |
|---|---|---|
| Purpose | Help create a record | Define consistency rules |
| Provides | Fields and suggested content | Required fields and allowed values |
| Used by | Authors and AI assistants | Validation tools |

A **template** provides a starting point. For example, our [requirement template](../examples/structured-content/templates/requirement.md) includes metadata fields, a requirement statement, and a rationale.

Our [schema](../examples/structured-content/schema.yaml) defines rules, such as requiring an `id` and restricting requirement statuses to `proposed`, `approved`, or `retired`. The project chooses these rules; YAML does not enforce them on its own.

A validation tool can apply those rules and report violations.

However, a record that passes validation can still contain an incorrect or ambiguous requirement. Structural consistency and content quality are different things.

[Chapter 7](../docs/07-processing.md) demonstrates automated validation and processing. A schema needs a tool that understands and applies its rules; it is not activated just by saving the file.

Not every piece of information needs the same fields.

A requirement may need an owner, approval status, and references to tests. A meeting decision may instead need a decision date, participants, and rationale.

Start with the questions you want to answer, then choose fields that help answer them.

Avoid collecting metadata that nobody maintains or uses.

## Try It: Create a Requirement

Let's add a requirement to our fictional onboarding service.

Use the [requirement template](../examples/structured-content/templates/requirement.md) to create a proposed requirement stating that users must be able to identify the system associated with an access request. Work in your own exercise copy of the repository.

1. Copy the template to `examples/structured-content/records/REQ-016.md`. If that ID already exists, choose an unused ID and matching filename.
2. Replace every placeholder. Use the matching ID, `type: requirement`, `owner: onboarding-team`, and `status: proposed`.
3. Write one clear requirement statement and a short rationale.
4. Leave `verified_by: []` empty because no test has been identified.
5. Review the record for clarity, completeness, and consistency.

You can write the record manually or ask an AI assistant to create it from the template. In either case, review its content and do not allow the assistant to invent missing requirements.

**Expected result:** A readable requirement record with structured metadata, ready for review and subsequent validation. Creating the file does not automatically run a check.

**If the structure is unclear:** Compare the file with REQ-014 above. Check the front-matter delimiters, field names, indentation, and remaining placeholders.

**Keep:** The proposed record. Chapter 7 uses these records for processing; chapter 10 covers recording and reviewing changes.


## Try It: Update a Requirement

Let's experiment with the actual records in the repository.

You will need a local copy of the repository with Python and its required libraries installed. Follow the [linked environment setup guide](growth-measurement.md#prepare-a-local-environment) if you have not prepared the environment. Activate that environment before running the commands.

From the repository root, run:

```bash
python scripts/process_records.py
```

The processor creates three files under `build/records/`:

- `requirements.md`
- `dashboard.md`
- `ai-context.md`

Open them and inspect their contents.

Now edit:

[REQ-015](../examples/structured-content/records/REQ-015.md)

Change its status from `proposed` to `approved`. For this exercise, treat the change as a simulated approval rather than a real project decision.

If REQ-015 is already approved in your exercise copy, use another proposed requirement and note its ID. Create one using the requirement exercise above if necessary.

Run the processor again.

**Check the result:** Does the requirements view reflect the new status? Have the dashboard counts changed? Is REQ-015 now included in the AI context?

Finally, try introducing an invalid status and rerun the processor. Observe the validation error, then restore the correct value.

Remember that files from an earlier successful run may remain after a failed run. They should not be mistaken for newly validated results.

**Expected result:** One source change updates three views, while an invalid status prevents new outputs.

**If the result differs:** Check the starting records, allowed statuses, and the latest terminal message. Compare against your own dataset if it differs from the four supplied records.

**Keep:** Restore deliberate errors and retain a short note about the source change and its effects. Leave generated files under ignored `build/records/`. [Chapter 10](../docs/10-git-review.md) covers reviewing and recording source changes.

For input fingerprints, manifests, and further validation experiments, see the [processing reference](record-processing.md).


## Validation Rules

The processor reads `examples/structured-content/schema.yaml` and records directly inside `examples/structured-content/records/`. Its `--input` option can select another directory with the same layout. The schema uses a project-specific format; the Python code implements its checks.

Required fields must contain nonempty text. Record types and statuses must be supported. Unknown fields, duplicate IDs, empty record bodies, repeated relationship targets, missing references, and references to the wrong type are rejected.

Requirements support `proposed`, `approved`, and `retired`; tasks support `planned`, `in-progress`, and `complete`; tests support `planned` and `complete`. Test status does not model pass or fail.

A misspelled owner or nonempty template placeholder can still pass. The processor does not check a team directory or judge the meaning of the prose. The chapters and separate onboarding procedure are outside this validation.

The record maintainer agrees on rules; the processor maintainer tests their implementation. [The tests](../tests/test_records.py) check valid and invalid fixtures, not every current exercise record. Changing a schema may require coordinated record, template, and code updates.

## Connect the Procedure to the Work

The [draft procedure from chapter 4](../examples/onboarding/requesting-access.md) tells a requester to keep a reference number. We use that exercise copy of `PROC-001` here; chapter 1's approved demonstration remains a separate example. The table connects the instruction to the requirement, implementation task, and planned test behind it.

| Item | Perspective | Connection |
| --- | --- | --- |
| PROC-001 | Reader-facing instruction | Explains what the requester should do |
| REQ-014 | Service requirement | Requires the confirmation to supply a reference number |
| TASK-003 | Implementation work | Records work intended to implement REQ-014 |
| TEST-008 | Verification plan | Describes how REQ-014 is intended to be checked |

An approved requirement describes what has been agreed. The task and test record the work needed to deliver and check it. Before using the procedure at work, someone must confirm that its instructions match how the service actually behaves.

The procedure is outside the four-record dataset processed in this chapter. We explain its connection to the requirement in the text and chapter 9's authored diagram; the program does not check that connection.

Keep three kinds of information distinct:

| Kind | Example | How it is maintained |
| --- | --- | --- |
| Authored content | Requirement and rationale | Written and reviewed |
| Authored metadata | ID, owner, status, relationships | Maintained according to agreed rules |
| Derived data | Counts by status or owner | Calculated from the records |

The first two kinds are maintained by authors; the third is calculated. For example, change a requirement's status in its record and let the program recalculate the totals. A status alone cannot tell you how long work has been in progress; that needs history. The [dashboard guide](dashboards-and-work-tracking.md) explores how to choose and interpret such measures.

## Identify the Inputs Behind a Result

Each output records the current Git commit and an input digest: a fingerprint calculated from the schema, record files, and processor code. The commit identifies the saved version you started from. The digest also reflects local edits that have not been committed.

The processor creates `manifest.json`, a file recording these details and a hash, or fingerprint, for each input file. These values help you check whether two runs used the same inputs. They do not store the inputs themselves; keep the source files if you need to reproduce a result.

## Author a Proposed Record

Copy `examples/structured-content/templates/requirement.md` into a new file in `examples/structured-content/records/`. Use a unique ID, replace every placeholder, and leave its status as `proposed`.

You can also ask an AI agent to create the record. Give it the template, the rules, and the requirement to express:

```text
Read examples/structured-content/templates/requirement.md and schema.yaml
in the same structured-content directory. Inspect the existing records.
Using only this fictional expectation, draft a new requirement:
"The requester must be able to identify which system an access request concerns."
Use the unused ID REQ-016; stop if it already exists.
Set owner to onboarding-team and status to proposed.
Keep verified_by empty; do not invent a test, service promise, or approval.
Save it as examples/structured-content/records/REQ-016.md.
Flag assumptions in your response and show the source diff.
Run the record processor if the environment is ready; otherwise say so.
Do not commit, push, or send records to another service.
```

Review whether the requirement expresses the supplied expectation, then inspect validation and generated views. A structurally valid invented promise remains wrong. Any rationale drafted by the agent also needs review.

Predict which outputs will change, then run `python scripts/process_records.py`. The new requirement should appear in the requirements document and dashboard, but not the approved-only AI package. Confirm that the input digest changed too. Create the record either manually or with the agent, not once by each method.

## Test a Validation Failure

Temporarily change REQ-014's test reference to a nonexistent ID, such as `TEST-999`. Predict whether processing will succeed. Run the processor, inspect the missing-reference error, then restore `TEST-008` and run it successfully.

When validation fails, the processor stops before writing outputs. Files from an earlier successful run may remain in `build/records/`; treat them as old results, not a successful rendering of the invalid inputs.

Review the final source diff and commit only the intended exercise changes. Record your predictions and what the outputs actually showed.

Restore deliberate errors before committing. Keep generated views under `build/records/`, outside version control.


Return to [chapter 7](../docs/07-processing.md) for the processing concepts.
