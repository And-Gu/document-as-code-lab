from pathlib import Path
import tempfile
import unittest

import yaml

from scripts.process_records import ROOT, load_records, views


class RecordTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.directory = Path(self.temp.name) / "example"
        records = self.directory / "records"
        records.mkdir(parents=True)
        self.schema = yaml.safe_load((ROOT / "examples/structured-content/schema.yaml").read_text())
        # Fixtures are independent of the records readers edit in the exercises.
        fixtures = [
            {"id": "REQ-014", "type": "requirement", "status": "approved", "verified_by": ["TEST-008"]},
            {"id": "REQ-015", "type": "requirement", "status": "proposed"},
            {"id": "TASK-003", "type": "task", "status": "in-progress", "implements": ["REQ-014"]},
            {"id": "TEST-008", "type": "test", "status": "planned"},
        ]
        for fixture in fixtures:
            metadata = {**fixture, "owner": "test-team", "title": fixture["id"]}
            (records / (fixture["id"] + ".md")).write_text(
                "---\n" + yaml.safe_dump(metadata) + "---\n\nFixture body.\n")

    def load(self):
        return load_records(self.directory / "records", self.schema)

    def replace(self, filename, before, after):
        path = self.directory / "records" / filename
        path.write_text(path.read_text().replace(before, after))

    def test_context_selection_changes_when_proposal_is_approved(self):
        provenance = {"base_commit": "abc", "input_sha256": "digest"}
        outputs = views(self.load(), provenance)
        self.assertIn("REQ-015", outputs["requirements.md"])
        self.assertNotIn("REQ-015", outputs["ai-context.md"])
        self.replace("REQ-015.md", "status: proposed", "status: approved")
        self.assertIn("REQ-015", views(self.load(), provenance)["ai-context.md"])

    def test_broken_reference_is_rejected(self):
        self.replace("REQ-014.md", "TEST-008", "TEST-999")
        with self.assertRaisesRegex(ValueError, "missing reference"):
            self.load()

    def test_duplicate_id_is_rejected(self):
        self.replace("REQ-015.md", "id: REQ-015", "id: REQ-014")
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            self.load()

    def test_wrong_relationship_type_is_rejected(self):
        self.replace("REQ-014.md", "TEST-008", "TASK-003")
        with self.assertRaisesRegex(ValueError, "wrong target type"):
            self.load()

    def test_status_is_checked_against_record_type(self):
        self.replace("REQ-014.md", "status: approved", "status: complete")
        with self.assertRaisesRegex(ValueError, "unsupported status"):
            self.load()


if __name__ == "__main__":
    unittest.main()
