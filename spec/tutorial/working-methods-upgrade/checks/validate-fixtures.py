"""Validate the specification's illustrative inputs, NOT the application."""
from pathlib import Path
from datetime import date
import json
import yaml

root = Path(__file__).resolve().parents[1]
records = {}
for p in (root / 'fixtures' / 'sources').glob('*.md'):
    raw = p.read_text(encoding='utf-8')
    frontmatter = raw.split('---', 2)[1]
    d = yaml.safe_load(frontmatter)
    assert d['fictional'] is True
    assert d['original_binary_file_provided'] is False
    assert d['id'] not in records
    records[d['id']] = d
assert len(records) == 5
facts = lambda sid: records[sid]['facts']
days = (date.fromisoformat(facts('SRC-FORECAST')['forecast_date']) - date.fromisoformat(facts('SRC-CUSTOMER')['customer_commitment_date'])).days
capacity = facts('SRC-CAPACITY')['required_hours'] - facts('SRC-CAPACITY')['available_hours']
budget = facts('SRC-BUDGET')
variance = budget['forecast_minor'] - budget['baseline_minor']
pct = f"{variance / budget['baseline_minor'] * 100:.1f}%"
casefile = json.loads((root / 'fixtures' / 'expected-cases.json').read_text())
base = casefile['cases'][0]['expected']
assert days == base['calendar_days_after_commitment'] == 5
assert capacity == base['capacity_shortfall_hours'] == 8
assert variance == base['budget_variance_minor'] == 2_600_000
assert pct == base['budget_variance_percent_display'] == '14.4%'
assert facts('SRC-MEETING')['approval_evidence'] is None
ids = [case['id'] for case in casefile['cases']]
assert len(ids) == len(set(ids)) == 11
scenario = json.loads((root / 'fixtures' / 'scenario.json').read_text())
assert scenario['live_ai'] is False and scenario['external_network_required'] is False
assert scenario['as_of'] == '2026-11-04'
for p in scenario['new_source_paths']:
    assert (root / 'fixtures' / 'sources' / Path(p).name).exists()
result = {
    'scope': 'Specification fixture consistency only. No proposed application checks executed.',
    'status': 'passed',
    'source_records_checked': len(records),
    'expected_cases_defined': len(ids),
    'baseline_calendar_day_gap': days,
    'baseline_capacity_shortfall_hours': capacity,
    'baseline_budget_variance_minor_sek': variance,
    'baseline_budget_variance_percentage': pct,
    'application_implementation': 'not performed',
    'browser_tests_for_proposed_changes': 'not run',
    'hosted_verification_for_proposed_changes': 'not run',
    'reader_study': 'not run'
}
(root / 'checks' / 'fixture-consistency-result.json').write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps(result, indent=2))
