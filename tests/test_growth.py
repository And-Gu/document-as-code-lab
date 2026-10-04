import unittest
import json
from pathlib import Path
import subprocess
import tempfile
from unittest.mock import patch

from scripts.measure_growth import chapter_metrics, historical_snapshot, snapshot, main


class GrowthTests(unittest.TestCase):
    def test_json_only_preserves_report_without_rendering(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch('sys.argv', ['measure_growth', '--json-only', '--output', directory]), \
                    patch('scripts.measure_growth.render') as render:
                main()
            render.assert_not_called()
            report = json.loads((Path(directory) / 'history.json').read_text())
            self.assertEqual(report['measurement_version'], 3)
            self.assertTrue(report['history'])
            self.assertEqual(report['history'][-1]['kind'], 'commit')
            self.assertFalse((Path(directory) / 'growth.png').exists())

    def test_drafted_chapters_are_separate_from_file_count(self):
        files = {f"docs/{name}.md": f"---\nid: {name}\nstatus: {status}\n---\n# {name}"
                 for name, status in [("one", "outline"), ("two", "draft"), ("three", "complete")]}
        result = snapshot(list(files), files.__getitem__, {})
        self.assertEqual(result["chapter_count"], 3)
        self.assertEqual(result["draft_or_complete_chapters"], 2)

    def test_metadata_examples_and_links_are_not_counted_as_prose(self):
        text = "---\nid: sample\nstatus: draft\n---\n# Hello\nRead [the guide](https://example.com).\n```yaml\nignored: words\n```\n<!-- hidden words -->"
        record = chapter_metrics("docs/sample.md", text)
        self.assertEqual(record["words"], 4)
        self.assertEqual(record["status"], "draft")

    def test_review_and_approval_preserve_developed_chapter_count(self):
        for status in ["draft", "in-review", "approved", "complete"]:
            with self.subTest(status=status):
                text = f"---\nid: introduction\nstatus: {status}\n---\n# Introduction"
                result = snapshot(["docs/introduction.md"], lambda _: text, {})
                self.assertEqual(result["draft_or_complete_chapters"], 1)
                self.assertEqual(result["chapters"][0]["status"], status)

    def test_legacy_chapter_status_is_preserved(self):
        record = chapter_metrics("docs/x.md", "# Example\n- Chapter ID: `old-id`\n- Status: outline\nBody")
        self.assertEqual(record["id"], "old-id")
        self.assertEqual(record["status"], "outline")
        self.assertEqual(record["words"], 2)

    def test_missing_register_is_unknown_not_zero(self):
        result = snapshot(["docs/x.md"], lambda p: "# X", {})
        self.assertIsNone(result["complete_features"])

    def test_duplicate_ids_fail(self):
        with self.assertRaises(ValueError):
            snapshot(["docs/a.md", "docs/b.md"], lambda p: "---\nid: same\n---\n# X", {})

    def test_nested_markdown_and_readme_do_not_count_as_chapters(self):
        files = {"docs/chapter.md": "# Chapter", "docs/examples/helper.md": "# Helper",
                 "README.md": "# Project"}
        result = snapshot(list(files), files.__getitem__, {})
        self.assertEqual(result["chapter_count"], 1)
        self.assertEqual(result["word_count"], 1)

    def test_history_reads_old_content_and_feature_state(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            def run(*args):
                return subprocess.check_output(["git", *args], cwd=root, text=True,
                                               stderr=subprocess.DEVNULL).strip()
            run("init", "-b", "main")
            run("config", "user.name", "Test")
            run("config", "user.email", "test@example.com")
            (root / "docs").mkdir()
            (root / "data").mkdir()
            chapter = root / "docs/example.md"
            register = root / "data/features.json"
            chapter.write_text("# Example\nFirst words")
            (root / "docs/examples").mkdir()
            (root / "docs/examples/helper.md").write_text("# Helper\nExcluded prose")
            register.write_text(json.dumps({"features": [{"id": "one", "status": "planned"}]}))
            run("add", ".")
            run("commit", "-m", "Initial")
            first = run("rev-parse", "HEAD")
            chapter.write_text("# Example\nFirst words and more")
            register.write_text(json.dumps({"features": [{"id": "one", "status": "complete"}]}))
            run("add", ".")
            run("commit", "-m", "Grow")
            second = run("rev-parse", "HEAD")
            with patch("scripts.measure_growth.ROOT", root):
                old = historical_snapshot(first)
                new = historical_snapshot(second)
                self.assertEqual(old["word_count"], 3)
                self.assertEqual(new["word_count"], 5)
                self.assertEqual(old["complete_features"], 0)
                self.assertEqual(new["complete_features"], 1)
                self.assertEqual(old["chapter_count"], 1)
                self.assertEqual(new["chapter_count"], 1)


if __name__ == "__main__":
    unittest.main()
