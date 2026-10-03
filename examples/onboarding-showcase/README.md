# Onboarding Showcase

This is a fictional dataset for chapter 1, separate from the editable onboarding exercise used in chapter 4. The three files describe an illustrative review state: two procedures are approved and contacts remains draft. No real operational approval is implied.

The builder reads access.md, equipment.md, and contacts.md in that order. It writes a handbook review copy containing all three records, an access-only training excerpt, a status chart, and a data file with input hashes.

After preparing the Python environment described in chapter 3, run this from the repository root:

```bash
python scripts/build_onboarding_showcase.py
```

Outputs are saved under assets/onboarding-showcase as fixed teaching assets. Review and commit them together with their inputs when deliberately changing this example. If statuses or owners change, also update chapter 1's explanatory table, caption, and alternative text.

The handbook includes draft content and is a review copy. The training excerpt reuses source text; it is not a finished slide deck or an AI-generated response. The chart is an authored-status summary, not independent evidence of approval.
