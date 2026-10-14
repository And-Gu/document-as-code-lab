"""Build a small PDF trial from maintained chapters, not copied prose."""
import csv
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
from urllib.parse import urljoin, urlparse

import pypandoc
import typst
import yaml

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "build/pdf-proof"
CONFIG = ROOT / "publishing/pdf"


def convert(text, target):
    return pypandoc.convert_text(text, target, format="markdown")


def chapter(filename):
    path = ROOT / "docs" / filename
    _, front, body = path.read_text().split("---", 2)
    return yaml.safe_load(front), json.loads(convert(body, "json"))


def heading(block):
    if block["t"] != "Header":
        return None
    return " ".join(item["c"] for item in block["c"][2] if item["t"] == "Str")


def section(ast, title):
    active = False
    result = []
    for block in ast["blocks"]:
        if block["t"] == "Header" and block["c"][0] <= 2:
            if active:
                break
            active = heading(block) == title
            continue
        if active:
            result.append(block)
    if not result:
        raise ValueError(f"Missing section: {title}")
    return result


def render(ast, blocks):
    def links(value):
        if isinstance(value, dict):
            if value.get('t') == 'Link':
                target = value['c'][2][0]
                if not urlparse(target).scheme and not target.startswith('#'):
                    value['c'][2][0] = urljoin('https://github.com/And-Gu/document-as-code-lab/blob/main/docs/', target)
            for child in value.values():
                links(child)
        elif isinstance(value, list):
            for child in value:
                links(child)
    links(blocks)
    return pypandoc.convert_text(json.dumps({**ast, "blocks": blocks}), "typst", format="json")


def quoted(value):
    return json.dumps(str(value), ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--prepared-svg', type=Path, help='Use an explicitly supplied SVG instead of launching Mermaid CLI')
    options = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    revision = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, text=True).strip()
    dirty = bool(subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT, text=True).strip())
    label = revision + (" + working-tree changes" if dirty else "")
    inputs = ["docs/01-introduction.md", "docs/05-structured-content.md", "reference/dashboards-and-work-tracking.md", "assets/diagrams/01-source-to-outcomes.mmd", "examples/dashboards/department-budget.cssv"]
    args = [str(CONFIG / "node_modules/.bin/mmdc"), "-i", str(ROOT / inputs[3]), "-o", str(OUT / "onboarding.svg"), "-c", str(CONFIG / "mermaid.json"), "-b", "transparent"]
    if options.prepared_svg:
        if options.prepared_svg.resolve() != (OUT / 'onboarding.svg').resolve():
            shutil.copyfile(options.prepared_svg, OUT / 'onboarding.svg')
    else:
        subprocess.run(args, cwd=ROOT, check=True, env=os.environ.copy())
    pieces = ["= From Markdown to a Designed PDF\n\nA publishing trial using maintained chapter excerpts. Whole-page SVG export is excluded. This is not the full tutorial or an approved publication.\n\n"]
    for filename, title, section_title in [
        ("01-introduction.md", "1. Information Becomes a Publication", "From a document to maintained information"),
        ("05-structured-content.md", "2. Structure and Metadata", "From fields to useful views"),
        ("../reference/dashboards-and-work-tracking.md", "3. A Table for Print", "Missing Excel? Tables and Spreadsheets"),
    ]:
        meta, ast = chapter(filename)
        if len(pieces) > 1:
            pieces.append("#pagebreak()\n")
        pieces.append(f"== {title}\n")
        pieces.append("#chapter-info(" + ", ".join(quoted(meta[key]) for key in ["chapter_number", "status", "id"]) + ", " + quoted(label) + ")\n")
        blocks = section(ast, section_title)
        if meta["chapter_number"] == 1:
            pieces.append(render(ast, [b for b in blocks if b["t"] == "Para"][:2]))
            visual = next(item for item in meta["visuals"] if item["source"].endswith("01-source-to-outcomes.mmd"))
            pieces.append(f'\n#figure(image("onboarding.svg", width: 100%, alt: {quoted(visual["alt"])}), caption: [{visual["caption"]}])\n')
        elif meta["chapter_number"] == 5:
            metadata = section(ast, "Metadata: information about information")
            pieces.append(render(ast, [b for b in metadata if b["t"] == "CodeBlock"] + [b for b in blocks if b["t"] in ["Para", "Table"]]))
        else:
            pieces.append(render(ast, [b for b in blocks if b["t"] == "Para"][:1]))
            _, _, data = (ROOT / inputs[4]).read_text().split("---", 2)
            rows = list(csv.reader(io.StringIO(data.strip())))
            pieces.append("\nFictional annual department budget. Amounts in SEK. Positive variance means overspending.\n\n")
            pieces.append('#table(columns: (2fr, 1fr, 1fr, 1fr), align: (left, right, right, right),\n table.header(' + ",".join(f"[{cell}]" for cell in rows[0]) + "),\n")
            totals = [0, 0, 0]
            for row in rows[1:]:
                values = list(map(int, row[1:]))
                if values[2] != values[1] - values[0]:
                    raise ValueError("Budget variance does not reconcile")
                totals = [a + b for a, b in zip(totals, values)]
                fill = 'rgb("fff1e5")' if values[2] > 0 else "white"
                for cell in [row[0], *(f"{n:,}" for n in values)]:
                    pieces.append(f"table.cell(fill: {fill})[{cell}],\n")
            pieces.append(",".join(f"[*{cell}*]" for cell in ["Total", *(f"{n:,}" for n in totals)]) + ")\n")
            pieces.append("\nThe PDF uses the data from the CSSV file, with native Typst table styling. Browser CSS, sorting, and filtering are not carried into this publication.\n\nEquipment and Travel together exceed their allocations by 21,000 SEK. The net variance across all categories is 11,000 SEK.\n")
            pieces.append('#link("https://and-gu.github.io/document-as-code-lab/materials/reference/dashboards-and-work-tracking/#missing-excel-tables-and-spreadsheets")[Explore the interactive website example.]\n')
    pieces.append("\n== Publication Notes\nSource excerpts retain their chapter status. The book needs its own publication review. Tables remain text, the Mermaid diagram is SVG, and there are no screenshots of document pages.\n\nThis proof does not yet test full-book navigation, every diagram, long-table pagination, or PDF/UA conformance.\n")
    (OUT / "body.typ").write_text("\n".join(pieces))
    (OUT / 'proof.typ').write_text((CONFIG / 'template.typ').read_text().replace('#include "body.typ"', '\n'.join(pieces)))
    typst.compile(str(OUT / "proof.typ"), output=str(OUT / "document-as-code-proof.pdf"), root=str(ROOT))
    manifest = {"revision": label, "inputs": {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in inputs}, "pandoc": str(pypandoc.get_pandoc_version()), "typst_binding": "0.15.0", "mermaid_cli": "12.0.0", "diagram_method": "externally prepared SVG" if options.prepared_svg else "Mermaid CLI", "svg_sha256": hashlib.sha256((OUT / 'onboarding.svg').read_bytes()).hexdigest()}
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(OUT / "document-as-code-proof.pdf")


if __name__ == "__main__":
    main()
