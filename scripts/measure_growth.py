"""Reconstruct chapter and capability metrics from first-parent Git history."""

import argparse
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import textwrap

import yaml

ROOT = Path(__file__).resolve().parents[1]
MEASUREMENT_VERSION = 3


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True)


def chapter_metrics(path, text):
    lines = text.splitlines()
    metadata = {}
    if lines and lines[0] == "---":
        end = lines.index("---", 1)
        metadata = yaml.safe_load("\n".join(lines[1:end])) or {}
        lines = lines[end + 1:]
    body = "\n".join(lines)
    legacy_status = re.search(r"^- Status: (.+)$", body, re.MULTILINE)
    status = metadata.get("status", legacy_status.group(1) if legacy_status else "unknown")
    if status.startswith("draft"):
        status = "draft"
    title = next((line[2:] for line in lines if line.startswith("# ")), path)
    legacy_id = re.search(r"^- Chapter ID: `([^`]+)`", body, re.MULTILINE)
    chapter_id = metadata.get("id", legacy_id.group(1) if legacy_id else Path(path).stem)
    # Count human-readable prose, excluding fenced examples and editorial fields.
    prose = []
    fence = None
    for line in lines:
        marker = re.match(r"^\s*(`{3,}|~{3,})", line)
        if marker:
            token = marker.group(1)
            if fence is None:
                fence = token
            elif token[0] == fence[0] and len(token) >= len(fence):
                fence = None
            continue
        if fence or re.match(r"^- (Chapter ID|Status):", line):
            continue
        prose.append(line)
    content = re.sub(r"<!--.*?-->", "", "\n".join(prose), flags=re.DOTALL)
    content = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", content)
    words = len(re.findall(r"\b\w+(?:['’-]\w+)*\b", content))
    return {"id": str(chapter_id), "path": path, "title": title,
            "status": status, "words": words}


def snapshot(paths, read, identity):
    chapters = [chapter_metrics(p, read(p)) for p in sorted(paths)
                if PurePosixPath(p).parent == PurePosixPath("docs") and p.endswith(".md")]
    ids = [c["id"] for c in chapters]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate chapter IDs")
    features = None
    if "data/features.json" in paths:
        features = json.loads(read("data/features.json"))["features"]
        if len({f["id"] for f in features}) != len(features):
            raise ValueError("Duplicate feature IDs")
        if any(f["status"] not in {"planned", "in-progress", "complete"} for f in features):
            raise ValueError("Unsupported feature status")
    return {**identity, "chapter_count": len(chapters),
            "draft_or_complete_chapters": sum(c["status"] in {"draft", "in-review", "approved", "complete"} for c in chapters),
            "word_count": sum(c["words"] for c in chapters),
            "complete_features": None if features is None else sum(f["status"] == "complete" for f in features),
            "features": features, "chapters": chapters}


def historical_snapshot(sha):
    paths = git("ls-tree", "-r", "--name-only", sha).splitlines()
    date = git("show", "-s", "--format=%cI", sha).strip()
    return snapshot(paths, lambda p: git("show", f"{sha}:{p}"),
                    {"source_commit": sha, "committed_at": date, "kind": "commit"})


def render(report, output):
    os.environ.setdefault("MPLCONFIGDIR", str(ROOT / "build/.matplotlib"))
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    rows = report["history"] + ([report["working_tree"]] if report.get("working_tree") else [])
    x = list(range(len(rows)))
    labels = [r["source_commit"][:7] if r["kind"] == "commit" else "Working tree" for r in rows]
    fig, axes = plt.subplots(4, 1, figsize=(10, 11), sharex=True, layout="constrained")
    for ax, field, title, color in zip(axes,
            ["word_count", "chapter_count", "draft_or_complete_chapters", "complete_features"],
            ["Prose words", "Chapter files (including outlines)", "Draft or complete chapters", "Completed capabilities"],
            ["#187b6b", "#b54765", "#3975a5", "#6b5b95"]):
        values = [r[field] if r[field] is not None else float("nan") for r in rows]
        committed_count = len(report["history"])
        ax.plot(x[:committed_count], values[:committed_count],
                marker="o", color=color, linewidth=2)
        if len(rows) > committed_count:
            ax.plot(x[-2:], values[-2:], marker="o", color=color,
                    linewidth=2, linestyle="--")
        ax.set_title(title, loc="left", fontsize=12)
        ax.set_ylim(bottom=0)
        ax.grid(axis="y", alpha=0.2)
        if field != "word_count":
            from matplotlib.ticker import MaxNLocator
            ax.set_ylim(0, max(1, max((r[field] or 0) for r in rows) * 1.15))
            ax.yaxis.set_major_locator(MaxNLocator(integer=True))
    ticks = sorted(set(x[::max(1, len(x) // 8)] + [x[-1]]))
    axes[-1].set_xticks(ticks, [labels[i] for i in ticks], rotation=25, ha="right")
    fig.suptitle("Project growth by revision", fontsize=17)
    fig.savefig(output / "growth.png", dpi=150)
    plt.close(fig)

    latest = rows[-1]
    fig, ax = plt.subplots(figsize=(12, max(4, len(latest["chapters"]) * 0.65)), layout="constrained")
    labels_by_chapter = [textwrap.fill(f"{Path(c['path']).stem.split('-')[0]}. {c['title']}", 44)
                         for c in latest["chapters"]]
    bars = ax.barh(labels_by_chapter, [c["words"] for c in latest["chapters"]], color="#187b6b")
    ax.bar_label(bars, padding=4)
    ax.set_xlim(0, max(1, max((c["words"] for c in latest["chapters"]), default=0)) * 1.15)
    ax.invert_yaxis()
    ax.set_xlabel("Prose words (outlines included)")
    ax.set_title("Chapter sizes: " + labels[-1], loc="left")
    fig.savefig(output / "chapter-sizes.png", dpi=150)
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ref", default="HEAD")
    parser.add_argument("--include-working-tree", action="store_true")
    parser.add_argument("--json-only", action="store_true", help="Write report data without rendering charts")
    parser.add_argument("--output", type=Path, default=ROOT / "build/growth")
    args = parser.parse_args()
    if git("rev-parse", "--is-shallow-repository").strip() == "true":
        parser.error("Full history is required. Run git fetch --unshallow first.")
    tip = git("rev-parse", "--verify", f"{args.ref}^{{commit}}").strip()
    history = [historical_snapshot(sha) for sha in git("rev-list", "--first-parent", "--reverse", tip).splitlines()]
    report = {"measurement_version": MEASUREMENT_VERSION, "history": history}
    if args.include_working_tree:
        if tip != git("rev-parse", "HEAD").strip():
            parser.error("Working-tree preview must use HEAD")
        paths = [str(p.relative_to(ROOT)) for p in (ROOT / "docs").glob("*.md")]
        if (ROOT / "data/features.json").exists():
            paths.append("data/features.json")
        report["working_tree"] = snapshot(paths, lambda p: (ROOT / p).read_text(),
            {"source_commit": tip, "kind": "working-tree", "committed_at": None})
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "history.json").write_text(json.dumps(report, indent=2) + "\n")
    if not args.json_only:
        render(report, args.output)
    latest = report.get("working_tree", history[-1])
    print(f"Measured {len(history)} committed revisions; latest: "
          f"{latest['chapter_count']} chapters, {latest['word_count']} prose words, "
          f"{latest['draft_or_complete_chapters']} draft or complete chapters, "
          f"{latest['complete_features']} completed capabilities.")
    label = "Report data" if args.json_only else "Report and charts"
    print(f"{label}: {args.output}")


if __name__ == "__main__":
    main()
