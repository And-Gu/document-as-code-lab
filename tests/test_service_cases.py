import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("service_cases", ROOT / "scripts/analyze_service_cases.py")
service_cases = importlib.util.module_from_spec(spec)
spec.loader.exec_module(service_cases)


class ServiceCaseTests(unittest.TestCase):
    def setUp(self):
        self.source = json.loads(service_cases.SOURCE.read_text())

    def test_calculation_and_exclusions(self):
        report = service_cases.analyze(self.source)
        self.assertEqual((report["source_count"], report["included_count"], report["median_days"]), (5, 3, 6))
        self.assertEqual([row["duration_days"] for row in report["cases"]], [3, 7, None, -2, 6])
        self.assertEqual([row["id"] for row in report["cases"] if not row["included"]], ["C-103", "C-104"])

    def test_source_edit_changes_result_without_mutating_input(self):
        changed = copy.deepcopy(self.source)
        changed["cases"][1]["closed"] = "2026-04-06"
        original = copy.deepcopy(changed)
        self.assertEqual(service_cases.analyze(changed)["median_days"], 4)
        self.assertEqual(changed, original)

    def test_no_usable_dates_has_unknown_median(self):
        self.source["cases"] = self.source["cases"][2:4]
        self.assertIsNone(service_cases.analyze(self.source)["median_days"])

    def test_missing_duplicate_ids_and_invalid_dates_fail(self):
        for mutate in [lambda rows: rows[0].pop("id"),
                       lambda rows: rows[1].update(id=rows[0]["id"]),
                       lambda rows: rows[0].update(opened="2026-04-31")]:
            with self.subTest(mutate=mutate):
                data = copy.deepcopy(self.source)
                mutate(data["cases"])
                with self.assertRaises(ValueError):
                    service_cases.analyze(data)

    def test_saved_artifacts_are_reproducible(self):
        for name, content in service_cases.artifacts().items():
            self.assertEqual((service_cases.OUTPUT / name).read_bytes(), content, name)


if __name__ == "__main__":
    unittest.main()
