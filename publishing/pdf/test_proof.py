import sys
import json
import unittest
import tempfile
import hashlib
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
import build_pdf_proof as proof
import verify_pdf_proof as verify


class ProofTests(unittest.TestCase):
    def test_pdf_checks_and_report(self):
        with tempfile.TemporaryDirectory() as directory:
            out = Path(directory)
            (out / 'manifest.json').write_text('{}')
            results = ['Pages: 3\n', 'Source ID: Source revision: 200,000 211,000 11,000 DESIGN PROOF',
                       'page num type\n------------\n', 'font information']
            with patch.object(verify, 'OUT', out), patch.object(verify, 'verify_svg'), \
                    patch.object(verify, 'verify_manifest'), \
                    patch.object(verify.subprocess, 'check_output', side_effect=results):
                verify.main()
            self.assertEqual(json.loads((out / 'verification.json').read_text())['pages'], 3)

    def test_pdf_checks_reject_wrong_pagination_missing_text_and_raster(self):
        valid_text = 'Source ID: Source revision: 200,000 211,000 11,000 DESIGN PROOF'
        for results in (['Pages: 4\n'], ['Pages: 3\n', 'missing content'],
                        ['Pages: 3\n', valid_text, ' 1 0 image 100 100']):
            with tempfile.TemporaryDirectory() as directory:
                out = Path(directory)
                (out / 'manifest.json').write_text('{}')
                with patch.object(verify, 'OUT', out), patch.object(verify, 'verify_svg'), \
                        patch.object(verify, 'verify_manifest'), \
                        patch.object(verify.subprocess, 'check_output', side_effect=results):
                    with self.assertRaises(ValueError):
                        verify.main()

    def test_vector_svg_and_manifest(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'diagram.svg'
            path.write_text('<svg xmlns="http://www.w3.org/2000/svg"><rect/><text>Test</text></svg>')
            verify.verify_svg(path)
            manifest = {'diagram_method': 'Mermaid CLI', 'inputs': {},
                        'svg_sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
            verify.verify_manifest(manifest, path)
            manifest['diagram_method'] = 'externally prepared SVG'
            with self.assertRaises(ValueError):
                verify.verify_manifest(manifest, path)

    def test_reject_html_raster_and_empty_diagrams(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'diagram.svg'
            for content in ('<foreignObject/>', '<image/>', ''):
                path.write_text(f'<svg xmlns="http://www.w3.org/2000/svg">{content}</svg>')
                with self.assertRaises(ValueError):
                    verify.verify_svg(path)

    def test_reject_changed_svg_or_source(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / 'diagram.svg'
            path.write_text('example')
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            manifest = {'diagram_method': 'Mermaid CLI', 'inputs': {}, 'svg_sha256': 'wrong'}
            with self.assertRaises(ValueError):
                verify.verify_manifest(manifest, path, root)
            manifest.update(svg_sha256=digest, inputs={'diagram.svg': 'wrong'})
            with self.assertRaises(ValueError):
                verify.verify_manifest(manifest, path, root)

    def test_chapter_metadata_and_selection(self):
        meta, ast = proof.chapter('05-structured-content.md')
        self.assertEqual(meta['chapter_number'], 5)
        blocks = proof.section(ast, 'From Documents to Records')
        examples = [block['c'][1] for block in blocks if block['t'] == 'CodeBlock']
        self.assertTrue(any('id: REQ-014' in text for text in examples))

    def test_metadata_field_reference_is_selectable(self):
        _, ast = proof.chapter('05-structured-content.md')
        blocks = proof.section(ast, 'Understanding YAML Metadata')
        self.assertTrue(any(block['t'] == 'Table' for block in blocks))

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
