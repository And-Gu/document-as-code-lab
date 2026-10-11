import sys
import json
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
import build_pdf_proof as proof


class ProofTests(unittest.TestCase):
    def test_chapter_metadata_and_selection(self):
        meta, ast = proof.chapter('05-structured-content.md')
        self.assertEqual(meta['chapter_number'], 5)
        blocks = proof.section(ast, 'YAML for Structured Information')
        self.assertTrue(any(block['t'] == 'CodeBlock' for block in blocks))

    def test_missing_section_fails(self):
        _, ast = proof.chapter('01-introduction.md')
        with self.assertRaises(ValueError):
            proof.section(ast, 'A section that does not exist')

    def test_relative_links_become_web_links(self):
        ast = json.loads(proof.convert('[Notes](../presentations/README.md)', 'json'))
        rendered = proof.render(ast, ast['blocks'])
        self.assertIn('https://github.com/And-Gu/document-as-code-lab/blob/main/presentations/README.md', rendered)

    def test_external_links_are_preserved(self):
        ast = json.loads(proof.convert('[YAML](https://yaml.org/)', 'json'))
        self.assertIn('https://yaml.org/', proof.render(ast, ast['blocks']))


if __name__ == '__main__':
    unittest.main()
