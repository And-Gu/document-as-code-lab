import unittest

from scripts.build_record_diagram import diagram, label


class DiagramTests(unittest.TestCase):
    def setUp(self):
        self.schema = {"relationships": {"verified_by": {}, "implements": {}}}
        self.records = [
            {"id": "REQ-1", "type": "requirement", "verified_by": ["TEST-1"]},
            {"id": "TEST-1", "type": "test"},
            {"id": "REQ-2", "type": "requirement"},
        ]

    def test_all_records_and_only_explicit_edges(self):
        result = diagram(self.records, self.schema)
        self.assertEqual(result.count("-->"), 1)
        self.assertIn('n1["REQ-2: requirement"]', result)
        self.assertIn("n0 -->|verified_by| n2", result)
        self.assertNotIn("PROC-001", result)

    def test_deterministic_and_updates_after_relationship_change(self):
        before = diagram(self.records, self.schema)
        self.assertEqual(before, diagram(list(reversed(self.records)), self.schema))
        self.records[0]["verified_by"] = []
        self.assertNotIn("-->", diagram(self.records, self.schema))

    def test_labels_cannot_inject_mermaid_syntax(self):
        self.assertEqual(label('a"<b>|\nc'), "a#34;#60;b#62;#124;#10;c")


if __name__ == "__main__":
    unittest.main()
