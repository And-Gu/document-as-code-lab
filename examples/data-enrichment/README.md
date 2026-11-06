# Service-case investigation

These five fictional records support [Chapter 10](../../docs/10-data-enrichment.md). They are not commercial data or evidence of a real service trend.

## Sources and method

`cases.json` preserves the original values, including one missing closure date and one reversed date pair. Dates are date-only values in the fictional year 2026. Durations use calendar-date subtraction, not business hours; time zones are not applicable to these date-only records. Labels remain unchanged because no category mapping has been accepted.

The processor annotates missing and reversed dates rather than correcting or deleting them. It includes only nonnegative, known durations in the completed-case calculation. Missing closure does not, on its own, establish a case's operational state.

The calculated values are 3, 7, and 6 days. Their median is 6 days, with coverage of 3 out of 5 source cases. The other two cases remain visible in the report. All three usable durations belong to Team A, so this extract cannot support a comparison of team performance or a monthly trend.

## Reproduce

From the repository root, using the environment described in [the site guide](../../site/README.md):

```bash
.venv/bin/python scripts/analyze_service_cases.py
.venv/bin/python scripts/analyze_service_cases.py --check
.venv/bin/python -m unittest discover -s tests -p 'test_service_cases.py'
```

The first command regenerates `assets/data-enrichment/analysis.json` and `resolution-duration.svg`. The second fails if either saved output differs from the source and method. The report records the input SHA-256 and method version. The SVG and report are fixed teaching outputs, not dashboard snapshots. Review and commit changed inputs and outputs together; no application edits this source automatically.

The chapter repeats a short readable table for GitHub readers. Tests compare its rows and reported results with the maintained JSON and generated assets.
