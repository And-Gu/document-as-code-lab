"""Validate example records and build Markdown views without calling an AI service."""

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import subprocess

import yaml

ROOT = Path(__file__).resolve().parents[1]


def load_records(directory, schema):
    records = []
    for path in sorted(directory.glob("*.md")):
        text = path.read_text()
        lines = text.splitlines()
        if not lines or lines[0] != "---" or "---" not in lines[1:]:
            raise ValueError(f"{path.name}: missing front matter")
        end = lines.index("---", 1)
        record = yaml.safe_load("\n".join(lines[1:end]))
        if not isinstance(record, dict):
            raise ValueError(f"{path.name}: metadata must be a mapping")
        allowed = set(schema["required"]) | set(schema["relationships"])
        if set(record) - allowed:
            raise ValueError(f"{path.name}: unknown metadata fields")
        for field in schema["required"]:
            if not isinstance(record.get(field), str) or not record[field].strip():
                raise ValueError(f"{path.name}: {field} must be a nonempty string")
        if record["type"] not in schema["statuses"]:
            raise ValueError(f"{path.name}: unsupported record type")
        if record["status"] not in schema["statuses"][record["type"]]:
            raise ValueError(f"{path.name}: unsupported status for {record['type']}")
        body = "\n".join(lines[end + 1:]).strip()
        if not body:
            raise ValueError(f"{path.name}: missing body")
        for relation, rule in schema["relationships"].items():
            if relation not in record:
                continue
            targets = record[relation]
            if record["type"] != rule["from"] or not isinstance(targets, list):
                raise ValueError(f"{path.name}: invalid {relation}")
            if any(not isinstance(t, str) or not t.strip() for t in targets):
                raise ValueError(f"{path.name}: relationship IDs must be strings")
            if len(targets) != len(set(targets)):
                raise ValueError(f"{path.name}: repeated relationship target")
        records.append({**record, "body": body})
    if not records:
        raise ValueError("No records found")
    by_id = {r["id"]: r for r in records}
    if len(by_id) != len(records):
        raise ValueError("Duplicate record IDs")
    for record in records:
        for relation, rule in schema["relationships"].items():
            for target in record.get(relation, []):
                if target not in by_id:
                    raise ValueError(f"{record['id']}: missing reference {target}")
                if by_id[target]["type"] != rule["to"]:
                    raise ValueError(f"{record['id']}: wrong target type for {relation}")
    return records


def views(records, provenance):
    header = f"Base commit (local inputs may differ): `{provenance['base_commit']}`\n\nInput digest: `{provenance['input_sha256']}`\n\n"
    document = "# Requirements\n\n" + header + "Selection: all requirement records, including proposals.\n\n"
    for r in records:
        if r["type"] == "requirement":
            body = re.sub(r"^(#{1,5}) ", r"#\1 ", r["body"], flags=re.MULTILINE)
            document += f"## {r['id']}: {r['title']}\n\nStatus: {r['status']}. Owner: {r['owner']}.\n\n{body}\n\n"
            document += "Intended verification: " + ", ".join(r.get("verified_by", [])) + ".\n\n" if r.get("verified_by") else ""
    dashboard = "# Work Dashboard\n\n" + header + "Selection: all records. Counts describe metadata, not verified outcomes.\n\n"
    dashboard += "| Type | Status | Count |\n| --- | --- | --- |\n"
    for (kind, status), count in sorted(Counter((r["type"], r["status"]) for r in records).items()):
        dashboard += f"| {kind} | {status} | {count} |\n"
    dashboard += "\n| Owner | Records |\n| --- | --- |\n"
    for owner, count in sorted(Counter(r["owner"] for r in records).items()):
        dashboard += f"| {owner.replace('|', '&#124;')} | {count} |\n"
    selected = [r for r in records if r["type"] == "requirement" and r["status"] == "approved"]
    context = "# AI Context Package\n\n" + header
    context += "Audience: onboarding trainer.\n\nTask: draft a brief explanation of the approved requirements for new colleagues.\n\n"
    context += "Selection: approved requirements only. Related test and task contents are excluded. Approval does not establish implementation or a passing test. Do not invent operational instructions or claim the requirements are already satisfied. Identify missing context.\n\n"
    for r in selected:
        body = re.sub(r"^(#{1,5}) ", r"#\1 ", r["body"], flags=re.MULTILINE)
        context += f"## {r['id']}: {r['title']}\n\n{body}\n\n"
    if not selected:
        context += "No approved requirements were selected. Do not draft requirements from absent source material.\n"
    return {"requirements.md": document, "dashboard.md": dashboard, "ai-context.md": context}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=ROOT / "examples/structured-content")
    parser.add_argument("--output", type=Path, default=ROOT / "build/records")
    args = parser.parse_args()
    schema_path = args.input / "schema.yaml"
    schema = yaml.safe_load(schema_path.read_text())
    if schema["version"] != 1:
        parser.error("Unsupported schema version")
    try:
        records = load_records(args.input / "records", schema)
    except ValueError as error:
        parser.error(str(error))
    # Exact input hashes distinguish local edits from the base Git revision.
    files = [schema_path, *sorted((args.input / "records").glob("*.md")), Path(__file__)]
    hashes = {str(p.relative_to(args.input)) if p != Path(__file__) else "processor.py":
              hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
    digest = hashlib.sha256(json.dumps(hashes, sort_keys=True).encode()).hexdigest()
    provenance = {"base_commit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
                  "input_sha256": digest, "file_hashes": hashes, "schema_version": 1,
                  "source_kind": "working-tree"}
    outputs = views(records, provenance)
    args.output.mkdir(parents=True, exist_ok=True)
    for name, content in outputs.items():
        (args.output / name).write_text(content)
    (args.output / "manifest.json").write_text(json.dumps(provenance, indent=2) + "\n")
    print(f"Validated {len(records)} records; generated three views in {args.output}")


if __name__ == "__main__":
    main()
