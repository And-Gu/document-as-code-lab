"""Check this three-page proof; this is not a general PDF accessibility audit."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "build/pdf-proof"


def verify_svg(path):
    root = ET.parse(path).getroot()
    if root.tag != "{http://www.w3.org/2000/svg}svg":
        raise ValueError("Expected an SVG document")
    tags = {element.tag.rsplit("}", 1)[-1] for element in root.iter()}
    if tags & {"foreignObject", "image"}:
        raise ValueError("Proof diagram must use native SVG, not HTML or raster images")
    if "text" not in tags or not {"path", "rect", "polygon"} & tags:
        raise ValueError("Expected diagram labels and vector shapes")


def verify_manifest(manifest, svg, root=ROOT):
    if manifest["diagram_method"] != "Mermaid CLI":
        raise ValueError("Automated proof must render through Mermaid CLI")
    if hashlib.sha256(svg.read_bytes()).hexdigest() != manifest["svg_sha256"]:
        raise ValueError("SVG hash does not match the manifest")
    for name, expected in manifest["inputs"].items():
        if hashlib.sha256((root / name).read_bytes()).hexdigest() != expected:
            raise ValueError(f"Source hash changed: {name}")


def main():
    svg = OUT / "onboarding.svg"
    verify_svg(svg)
    verify_manifest(json.loads((OUT / "manifest.json").read_text()), svg)
    pdf = str(OUT / "document-as-code-proof.pdf")
    info = subprocess.check_output(["pdfinfo", pdf], text=True)
    if not re.search(r"^Pages:\s+3\s*$", info, re.MULTILINE):
        raise ValueError("Expected exactly three proof pages; inspect pagination")
    text = subprocess.check_output(["pdftotext", "-layout", pdf, "-"], text=True)
    for expected in ("Source ID:", "Source revision:", "200,000", "211,000", "11,000", "DESIGN PROOF"):
        if expected not in text:
            raise ValueError(f"Missing expected PDF text: {expected}")
    images = subprocess.check_output(["pdfimages", "-list", pdf], text=True)
    if any(re.match(r"^\s*\d+\s+\d+\s+", line) for line in images.splitlines()):
        raise ValueError("Unexpected raster images in this vector-only proof")
    fonts = subprocess.check_output(["pdffonts", pdf], text=True)
    report = {"pages": 3, "diagram_method": "Mermaid CLI", "raster_images": 0,
              "expected_text_present": True, "pdfinfo": info, "fonts": fonts,
              "review_required": "Inspect page PNGs; these checks do not establish PDF/UA compliance or publication approval."}
    (OUT / "verification.json").write_text(json.dumps(report, indent=2) + "\n")
    print("SVG provenance, PDF pagination, text, and vector-only checks passed.")


if __name__ == "__main__":
    main()
