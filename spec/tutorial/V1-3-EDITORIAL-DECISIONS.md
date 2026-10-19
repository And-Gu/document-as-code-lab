# Accepted Editorial Direction

19 October 2026. The owner accepted all three representative before/after samples and authorized applying their style across the tutorial. This accepts the editorial approach, not every resulting chapter revision or a publication.

## Chapter 2: A Concrete Opening

**Before**

> When information matters to several people, they need to know where it lives, what changed, and which version to trust. In this tutorial, we use a Git repository hosted on GitHub as our shared workspace.

**Accepted**

> Suppose the access procedure from chapter 1 needs a new step. The author needs somewhere to prepare the change, colleagues need to review it, and everyone needs to know which version they are reading.
>
> This tutorial uses a Git repository hosted on GitHub for that work. The repository keeps the source files and their history together. Git records revisions, while GitHub provides a shared place to propose and review changes.

The example gives the following definitions a purpose.

## Chapter 5: Explain the Mechanism

**Before**

> An authoring template provides a consistent starting layout. A schema defines the rules for the records. To check those records, a program must read the schema and apply its rules to the selected files. Saving the schema does not start that check automatically.
>
> The linked template and schema are examples for requirement records, such as REQ-014. They are not configured to check the onboarding procedures shown here. The editor exercise below uses a separate schema for procedure metadata.

**Accepted**

> A template helps an author create a consistent record. A schema defines what a program should check: for example, whether an identifier is present and whether the status uses an allowed value.
>
> The schema is a set of rules, not a running check. A validator must apply those rules to the intended files. In the lab below, Validate metadata runs that check on the procedure in the editor.
>
> Different records can need different rules. The linked requirement template and schema belong to the REQ-014 example; the onboarding editor uses its own procedure schema.

The explanation follows the authoring aid, rules, action, and scope. Existing source links remain in the chapter.

## Chapter 11: A Practical Conclusion

**Before**

> Choose one recurring information problem, an accountable owner, and a consumer who needs the result. Build a small, complete path from maintained sources through review and checks to one useful output. Agree who maintains the information, who reviews it, and who maintains the processing rules; these can be different people.
>
> Measure whether the result reduces update effort, catches errors, or helps the consumer make a decision. Extend the workflow when the benefit justifies the maintenance, learning, and support it requires.

**Accepted**

> You do not need to reproduce this entire lab to begin. Choose one recurring need: keeping instructions consistent, finding information awaiting review, or producing a report from shared records.
>
> Decide where the source belongs, who maintains and reviews it, and how it reaches the people who need it. Start with one useful result, then assess whether the approach saves effort or improves decisions before extending it.
>
> The tools may differ from ours. The aim remains the same: maintain the information once, make changes inspectable, and reuse it where it is needed.

The optional first-increment reference retains detailed ownership and planning guidance.

## Applying the Decision

The shared principles are situation before terminology, cohesive explanations, and natural transitions. They are not a mandatory sentence template, word quota, or permission to remove material qualifications. The maintained writing rules live in [CONTRIBUTING.md](../../CONTRIBUTING.md). The [editorial review](EDITORIAL-REVIEW.md) records the actual chapter changes and verification.
