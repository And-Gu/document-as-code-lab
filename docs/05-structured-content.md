---
id: 03a-structured-content
chapter_number: 5
status: draft
audience: practitioners-organizing-information-with-templates-and-metadata
learning_goal: Create a readable record from a template and explain its metadata and rules.
---

# Templates and Metadata

Chapter 4 introduced Markdown and the metadata placed at the start of a file. Here, we use that structure to organize information a team needs to maintain: what has been requested, who is responsible, and whether the request has been agreed.

We continue with the fictional onboarding service. Its access instructions tell a new colleague to keep a reference number. Behind that instruction is a requirement: the service must provide one.

By the end of this chapter, you will be able to create a requirement file from a template, explain its fields, and review it for clarity and completeness. You need an editor or an AI agent that can edit files; no processing program is needed for this exercise.

## From Prose to Records

A record is an information item with an identity and a consistent structure. In this example, each record is a separate Markdown file. Its prose explains the requirement; its metadata holds details such as its ID, owner, and status.

The file remains readable as a document. Its fields also make it possible for tools to find approved requirements or group work by owner. Planning items and customer tickets can use the same approach, with fields chosen for their needs.

## Start with a Template

A template gives an author a familiar starting point. It provides the fields to fill in and the sections to write, much like a Word template for a report or a PowerPoint template for a presentation.

Our [requirement template](../examples/structured-content/templates/requirement.md) supplies metadata, a requirement statement, and a rationale. Here is its starting structure:

```markdown
---
id: REPLACE-WITH-UNIQUE-ID
type: requirement
status: proposed
owner: REPLACE-WITH-OWNER
title: REPLACE-WITH-TITLE
verified_by: []
---

Describe one observable requirement.

## Rationale

Explain why the requirement matters.
```

To use the template, copy it into `examples/structured-content/records/`, replace the placeholders, and write the requirement and its rationale: the reason it matters. Keep its status as `proposed` until it has been reviewed. The empty list `verified_by: []` leaves room for links to test records when those exist.

Here is the complete existing [REQ-014 record](../examples/structured-content/records/REQ-014.md). It illustrates a filled-in template after a fictional review decision; a newly authored record should still start as `proposed`.

```markdown
---
id: REQ-014
type: requirement
status: approved
owner: onboarding-team
title: Access Confirmation
verified_by: [TEST-008]
---

The access service must confirm a submitted request with a reference number.

## Rationale

The requester needs a reference when asking about progress.
```

The statement says what the service must do, and the rationale explains why. The ID gives the record a stable identity even if its title changes. Tools can use the status to select approved requirements, the owner to group work by team, and `verified_by` to find the intended test.

Templates can also guide AI-assisted authoring. Provide the template, the relevant source information, and instructions about assumptions. Ask the tool to create a proposed record and flag missing information rather than invent it. Review the result before accepting it.

We keep templates in a separate directory so tools can distinguish starting files from maintained records. Replace every placeholder when creating a new file; later checks cannot judge whether the wording is complete or useful.

There are two useful kinds of template:

| Kind | Purpose | Example |
| --- | --- | --- |
| Authoring template | Help a person or AI tool create consistent records | Requirement metadata, statement, and rationale |
| Output template | Arrange selected records for an audience | A requirements document or AI context package |

This chapter uses an authoring template. The next chapter shows how a program selects records and arranges their content into outputs.

## YAML for Structured Information

We have already seen fields such as `id`, `owner`, and `status`. [YAML](https://yaml.org/spec/1.2.2/#chapter-2-language-overview) is a readable text format for storing this kind of structured information. It can hold individual values, lists, and groups of related fields.

In our Markdown records, YAML appears as front matter between the opening `---` lines, followed by the prose. A standalone `.yaml` file instead holds structured information on its own. We use both approaches: metadata stays with a requirement's text, while a presentation's teaching sequence lives in a separate YAML file.

For example, this excerpt from our [introduction deck definition](../presentations/document-as-code-intro.yaml) describes its opening slide:

```yaml
slides:
  - id: introduction
    type: title
    title: Document-as-Code
    subtitle: Maintain the knowledge. Shape the view.
    sources: [docs/01-introduction.md]
```

`title:` pairs a field name with its value. The dash starts an item in the `slides` list, and the indentation groups that slide's fields together. The brackets in `sources` hold a list with one chapter reference. Use spaces, not tabs, for indentation; changing it can change the structure.

The deck's messages are written for the presentation and linked to their source chapters. Astro reads the YAML to build the slides, but does not rewrite those messages when a chapter changes. [Chapter 11](11-publishing.md#our-html-presentations-use-astro-and-revealjs) explains the publishing process, and the [authoring notes](../presentations/README.md) describe the supported fields.

YAML supplies the notation for writing these values and lists. The next section introduces rules for which fields and values our tools accept.

## Agree on Rules with a Schema

A template gives authors a starting point. A schema describes the rules a checking tool should apply, such as required fields and allowed statuses. The team chooses these rules to support its work.

Our [schema file](../examples/structured-content/schema.yaml) requires an ID, type, status, owner, and title. Requirements can have the status `proposed`, `approved`, or `retired`. Tasks and tests have different allowed statuses.

These rules help keep records consistent. A requirement marked `complete`, for example, would not match our convention for requirements. However, a correctly structured file can still contain an unclear or incorrect statement. Review both the fields and the meaning.

A schema does not run itself. This project's schema uses a small format understood by a Python program included in the repository. [Chapter 6](06-processing.md) explains which files that program checks, how to run it, and what happens when a check fails.

## Choose Fields That Help the Work

Start with a question you need to answer. To find who should review a requirement, record its owner and status. To connect it to a planned test, record the test's ID. Avoid adding fields that nobody uses or maintains.

Keep IDs stable when titles or wording change. An approved requirement records an agreed expectation; it does not establish that the service has been implemented or tested. Those are separate pieces of information, which we connect in the next chapter.

The owner and status describe the maintained record. A count of approved requirements is calculated from records. Update the sources first, then regenerate such summaries rather than maintaining the same totals by hand.

## Try It: Create a Requirement Record

Work in your own exercise copy of the repository. Use a text editor or ask an AI agent to help.

1. Open [the requirement template](../examples/structured-content/templates/requirement.md). Copy it to `examples/structured-content/records/REQ-016.md`. If that ID already exists, inspect it or choose another unused ID.
2. Express this fictional requirement in your own words: the requester must be able to identify which system an access request concerns.
3. Replace every placeholder. Use `type: requirement`, `owner: onboarding-team`, and `status: proposed`. Leave `verified_by: []` empty because this exercise supplies no test.
4. Write a short rationale explaining why the requester needs this information. Distinguish your reasoning from facts supplied by the example.
5. Review the source and formatted preview. Is the requirement clear? Are the fields complete and consistent with the template? If you used an agent, check that it has not invented a process or promise.
6. Inspect the diff and commit only the intended record with a message explaining its purpose. Keep its status as proposed.

**Expected result:** a readable requirement record with an ID, owner, proposed status, and rationale. This is an authored proposal; automated validation comes next.

**If the structure is unclear:** compare the file with REQ-014 above. Check the two front-matter delimiters, field names, and indentation. An empty test list is appropriate when no test has been defined.

**Keep:** the record and its explanatory commit. Choose one field that would help organize an information item from your own work.

Next, [Processing Information into Views](06-processing.md) follows the record from editing through validation and into generated outputs, on your computer and in an automated workflow.
