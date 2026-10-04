# Growth Measurement Reference

Optional detail for [chapter 3](../docs/03-project-growth.md). These rules describe measurement version 3 in `scripts/measure_growth.py`.

## Counting Rules

- Count Markdown files directly inside `docs/` as chapters, including outlines.
- Use chapter IDs and statuses from YAML front matter, with support for the earlier inline chapter fields.
- Count prose in headings, tables, captions, and outline notes.
- Exclude YAML front matter, inline chapter identity and status fields, fenced code or diagram blocks, and HTML comments.
- Count link labels rather than destination URLs. Inline code remains part of the prose count.
- Count word-character sequences, optionally joined by apostrophes or hyphens. This is an approximate measure, not a full Markdown parser or an estimate of total reading effort.
- Exclude the README, this reference directory, scripts, supporting examples, assets, and generated reports from chapter totals.

Version 2 corrected historical counting to exclude nested Markdown files, matching working-tree previews. Version 3 includes `in-review` and `approved` alongside `draft` and `complete` in the existing `draft_or_complete_chapters` field, so review and approval do not reduce the count of chapters developed beyond an outline. Individual statuses remain available in the data. Earlier saved examples contain neither new status, so their numeric counts are unchanged when regenerated with version 3, although the report's version field differs. If rules change, update the measurement version and regenerate comparable history.

The current renderer shows four history panels, including the existing draft-or-complete count, and uses reading-order numbers and titles for chapter-size labels. Fixed older images retain their original layout and measurement version. Matplotlib caches stay under ignored `build/`, not alongside saved teaching assets.

## Reproduce a Revision

With the Python environment active, from the repository root:

```bash
python scripts/measure_growth.py --ref YOUR_COMMIT_ID --output build/growth-check
```

Replace `YOUR_COMMIT_ID` with the full commit ID from the report. With the same script and rules, compare the JSON values with that committed observation, not a later working-tree preview.

To recreate the original baseline:

```bash
python scripts/measure_growth.py --ref 8908932f8d0ed2d35ebcd9e59c5b58f2d4ae8cc5 --output build/baseline
```

Fixed teaching snapshots under `assets/figures/` retain their historical values. Regenerated working reports stay under ignored `build/`.

The complete-first-draft snapshot is pinned to `e7cd98089498c392db3f914fd74eb4f2bc97545f` in `assets/figures/growth-complete-draft/`. Rebuild it with that explicit `--ref`; later chapter edits are intentionally outside its totals.
