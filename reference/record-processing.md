# Record Processing: Experiments and Traceability

These optional activities extend [Processing Information into Views](../docs/06-processing.md). Complete its main exercise first, and work in your own exercise copy.

## Connect the Procedure to the Work

The [draft procedure from chapter 4](../examples/onboarding/requesting-access.md) tells a requester to keep a reference number. We use that exercise copy of `PROC-001` here; chapter 1's approved demonstration remains a separate example. The table connects the instruction to the requirement, implementation task, and planned test behind it.

| Item | Perspective | Connection |
| --- | --- | --- |
| PROC-001 | Reader-facing instruction | Explains what the requester should do |
| REQ-014 | Service requirement | Requires the confirmation to supply a reference number |
| TASK-003 | Implementation work | Records work intended to implement REQ-014 |
| TEST-008 | Verification plan | Describes how REQ-014 is intended to be checked |

An approved requirement describes what has been agreed. The task and test record the work needed to deliver and check it. Before using the procedure at work, someone must confirm that its instructions match how the service actually behaves.

The procedure is outside the four-record dataset processed in this chapter. We explain its connection to the requirement in the text and diagram; the program does not check that connection.

Keep three kinds of information distinct:

| Kind | Example | How it is maintained |
| --- | --- | --- |
| Authored content | Requirement and rationale | Written and reviewed |
| Authored metadata | ID, owner, status, relationships | Maintained according to agreed rules |
| Derived data | Counts by status or owner | Calculated from the records |

The first two kinds are maintained by authors; the third is calculated. For example, change a requirement's status in its record and let the program recalculate the totals. A status alone cannot tell you how long work has been in progress; that needs history. [Chapter 10](../docs/10-dashboards.md) explores how to choose and interpret such measures.

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


Return to [chapter 6](../docs/06-processing.md) for the full processing sequence.
