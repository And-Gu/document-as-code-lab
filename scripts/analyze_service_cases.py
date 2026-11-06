"""Reproduce Chapter 10's small fictional investigation and saved plot."""

import argparse
import hashlib
import io
import json
from datetime import date
from pathlib import Path
from statistics import median

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "examples/data-enrichment/cases.json"
OUTPUT = ROOT / "assets/data-enrichment"
METHOD = "calendar-date-duration-v1"


def analyze(document):
    records = document["cases"]
    if not records:
        raise ValueError("At least one case is required")
    seen, rows, durations = set(), [], []
    for record in records:
        identifier = record.get("id")
        if not isinstance(identifier, str) or not identifier or identifier in seen:
            raise ValueError("Missing or duplicate case ID")
        seen.add(identifier)
        for field in ("team", "label", "opened"):
            if not isinstance(record.get(field), str) or not record[field]:
                raise ValueError(f"{identifier}: missing {field}")
        opened = date.fromisoformat(record["opened"])
        closed = record["closed"]
        duration = None if closed is None else (date.fromisoformat(closed) - opened).days
        if duration is None:
            note = "Closure date missing; duration unknown"
        elif duration < 0:
            note = "Closure predates opening; verify source before calculating"
        else:
            note = "Included in duration calculation"
            durations.append(duration)
        rows.append({"id": identifier, "team": record["team"],
                     "duration_days": duration, "included": duration is not None and duration >= 0,
                     "annotation": note})
    return {"method": METHOD, "source_count": len(rows), "included_count": len(durations),
            "median_days": median(durations) if durations else None, "cases": rows}


def render_plot(report):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.ticker import MaxNLocator

    with plt.rc_context({"svg.fonttype": "none", "svg.hashsalt": METHOD,
                         "font.family": "DejaVu Sans", "font.size": 11}):
        included = [row for row in report["cases"] if row["included"]]
        fig, ax = plt.subplots(figsize=(7.2, 3.1), layout="constrained")
        ax.barh([row["id"] for row in included], [row["duration_days"] for row in included], color="#287b83")
        for index, row in enumerate(included):
            ax.text(row["duration_days"] + .12, index, f'{row["duration_days"]} days', va="center")
        if report["median_days"] is not None:
            ax.axvline(report["median_days"], color="#923b64", linestyle="--",
                       label=f'Median: {report["median_days"]:g} days')
            ax.legend(loc="lower right")
        ax.set_xlim(0, max([row["duration_days"] for row in included], default=1) + 1.7)
        ax.xaxis.set_major_locator(MaxNLocator(integer=True))
        ax.set_xlabel("Calendar days from opening to closure")
        ax.set_title(f'Fictional cases: {report["included_count"]} of {report["source_count"]} usable durations', loc="left")
        ax.spines[["top", "right"]].set_visible(False)
        buffer = io.BytesIO()
        fig.savefig(buffer, format="svg", metadata={"Date": None,
                    "Description": "Fictional case durations. Missing and invalid dates are excluded, not corrected."})
        plt.close(fig)
        return buffer.getvalue()


def artifacts():
    data = SOURCE.read_bytes()
    report = analyze(json.loads(data))
    report["source_sha256"] = hashlib.sha256(data).hexdigest()
    return {"analysis.json": (json.dumps(report, indent=2) + "\n").encode(),
            "resolution-duration.svg": render_plot(report)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail when saved teaching outputs are stale")
    args = parser.parse_args()
    for name, content in artifacts().items():
        target = OUTPUT / name
        if args.check:
            if not target.exists() or target.read_bytes() != content:
                raise SystemExit(f"Stale teaching output: {target.relative_to(ROOT)}")
        else:
            OUTPUT.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content)
    print("Service-case report and SVG match their source and method." if args.check else "Generated service-case report and SVG.")


if __name__ == "__main__":
    main()
