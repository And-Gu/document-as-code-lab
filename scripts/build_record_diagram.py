"""Generate Mermaid from validated records; rendering is a separate step."""

import argparse
import hashlib
import json
from pathlib import Path

import yaml

try:
    from .process_records import ROOT, load_records
except ImportError:
    from process_records import ROOT, load_records


def label(text):
    return "".join(c if c.isalnum() or c in " -_:" else f"#{ord(c)};" for c in text)


def diagram(records, schema):
    records = sorted(records, key=lambda r: r["id"])
    nodes = {r["id"]: f"n{i}" for i, r in enumerate(records)}
    lines = ["flowchart LR"]
    for r in records:
        lines.append(f'    {nodes[r["id"]]}["{label(r["id"] + ": " + r["type"])}"]')
    for r in records:
        for relation in sorted(schema["relationships"]):
            for target in sorted(r.get(relation, [])):
                lines.append(f"    {nodes[r['id']]} -->|{label(relation)}| {nodes[target]}")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=ROOT / "examples/structured-content")
    parser.add_argument("--output", type=Path, default=ROOT / "build/record-diagram")
    args = parser.parse_args()
    schema_path = args.input / "schema.yaml"
    schema = yaml.safe_load(schema_path.read_text())
    if schema["version"] != 1:
        parser.error("Unsupported schema version")
    try:
        records = load_records(args.input / "records", schema)
    except ValueError as error:
        parser.error(str(error))
    source = diagram(records, schema)
    paths = [schema_path, *sorted((args.input / "records").glob("*.md"))]
    hashes = {str(p.relative_to(args.input)): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
    for name in ("build_record_diagram.py", "process_records.py"):
        hashes[f"scripts/{name}"] = hashlib.sha256((ROOT / "scripts" / name).read_bytes()).hexdigest()
    digest = hashlib.sha256(json.dumps(hashes, sort_keys=True).encode()).hexdigest()
    manifest = {"input_sha256": digest, "file_hashes": hashes,
                "selection": "All validated records and explicit schema relationships; no conceptual links."}
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "relationships.mmd").write_text(source)
    (args.output / "relationships.md").write_text(
        "# Recorded Relationships\n\nInput digest: `" + digest + "`\n\n"
        "Arrows describe intended relationships, not verified outcomes.\n\n```mermaid\n" + source + "```\n")
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Generated Mermaid for {len(records)} records in {args.output}; not rendered.")


if __name__ == "__main__":
    main()
