"""Build chapter 1's fictional, fixed teaching example from three Markdown files."""

from collections import Counter
import hashlib
import json
import os
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "examples/onboarding-showcase"
OUTPUT = ROOT / "assets/onboarding-showcase"


def main():
    records = []
    for name in ["access.md", "equipment.md", "contacts.md"]:
        path = SOURCE / name
        parts = path.read_text().split("---", 2)
        metadata = yaml.safe_load(parts[1])
        lines = parts[2].strip().splitlines()
        records.append({**metadata, "file": name, "title": lines[0].removeprefix("# "),
                        "body": "\n".join(lines[1:]).strip(),
                        "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    OUTPUT.mkdir(parents=True, exist_ok=True)
    handbook = "# Onboarding Handbook\n\nFictional review copy. Includes draft material; not approved for operational use.\n\n"
    for record in records:
        handbook += f"## {record['title']}\n\nOwner: {record['owner']}. Status: {record['status']}.\n\n{record['body']}\n\n"
    (OUTPUT / "handbook.md").write_text(handbook)
    access = records[0]
    (OUTPUT / "training-excerpt.md").write_text(
        "# Training Excerpt: Requesting Access\n\nFictional source excerpt for a trainer to adapt; not a finished slide deck.\n\n"
        + access["body"] + "\n\nSource: PROC-001 from access.md.\n")
    (OUTPUT / "data.json").write_text(json.dumps({
        "kind": "fictional-teaching-example", "records": records,
        "processor_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    }, indent=2) + "\n")

    os.environ.setdefault("MPLCONFIGDIR", str(ROOT / "build/.matplotlib"))
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.ticker import MaxNLocator

    counts = Counter(record["status"] for record in records)
    labels = ["Approved", "Draft"]
    values = [counts["approved"], counts["draft"]]
    fig, ax = plt.subplots(figsize=(7, 3.4), layout="constrained")
    bars = ax.barh(labels, values, color=["#187b6b", "#b54765"], height=0.5)
    ax.bar_label(bars, padding=6)
    ax.invert_yaxis()
    ax.set_xlim(0, 3)
    ax.xaxis.set_major_locator(MaxNLocator(integer=True))
    ax.set_xlabel("Procedures")
    ax.set_title("Which procedure needs review?", loc="left", fontsize=15)
    fig.suptitle("Fictional onboarding example", fontsize=10, color="#555555")
    for side in ["top", "right"]:
        ax.spines[side].set_visible(False)
    fig.savefig(OUTPUT / "review-status.png", dpi=160)
    plt.close(fig)
    print(f"Built handbook review copy, training excerpt, data, and chart from {len(records)} files.")


if __name__ == "__main__":
    main()
