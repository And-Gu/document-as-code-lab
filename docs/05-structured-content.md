---
id: 03a-structured-content
chapter_number: 5
status: draft
audience: practitioners-organizing-information-with-templates-and-metadata
learning_goal: Create a readable record from a template and explain its metadata and rules.
---

# Templates and Metadata

Markdown gives us a simple way to write structured documents. But what happens when we need to manage hundreds of requirements, tasks, or procedures?

Imagine asking:

- Which requirements are approved?
- Who is responsible for them?
- Which requirements have associated tests?

Answering these questions manually becomes difficult as information grows.

**Metadata gives each information item a consistent identity and a set of fields that tools can use.**

In this chapter, we will create a requirement using a template, describe it with YAML metadata, and introduce rules for keeping records consistent.

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

[Chapter 6](06-processing.md) demonstrates automated validation and processing. A schema needs a tool that understands and applies its rules; it is not activated just by saving the file.

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

**Keep:** The proposed record. Chapter 6 uses these records for processing; chapter 9 covers recording and reviewing changes.

## What Comes Next?

We now have structured information with consistent fields and clear ownership.

In [Chapter 6: Processing Information into Views](06-processing.md), we will use programs to validate records, follow relationships, and generate useful outputs from the information we maintain.
