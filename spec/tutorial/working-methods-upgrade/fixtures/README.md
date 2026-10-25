# Fictional refinement-lab fixtures

These are proposed inputs for PR 2, not observations from any real business. The frozen scenario date is 4 November 2026. All sources are curated structured text; the package contains no Word, PDF or Excel original and no converter for those formats.

The five new Markdown files carry their numeric/date facts in YAML. Their prose explains scope without becoming another numeric source. In the implementation, generate readable field tables from those facts rather than maintaining copied values in a second UI dataset.

Copy `sources/*.md`, `scenario.json` and `identity-map.json` into their proposed `examples/information-refinement/` homes only during implementation. The manifest references existing DEL-101 and PRJ-101 records. Read those from the repository; do not manufacture copies. The existing delivery's planned date remains a separate fact from the new fictional customer commitment and forecast.

`expected-cases.json` is an independent test oracle for the new pure model. The implementation may adapt its technical test structure, but must retain the semantic cases. Expected test values are not runtime answers. The extra conflict/currency/instruction cases are negative-test inputs, not hidden additions to the default source bundle.

`../checks/validate-fixtures.py` verifies that the proposed baseline arithmetic, source references and case labels are coherent. It does not implement or test the future website, accessibility, AI execution or human learning. Its result file is explicitly limited to package-level validation.
