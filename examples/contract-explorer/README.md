# Contract Explorer Sources

Nine fictional Markdown records power chapter 9's Relationships, Commitments, and Change impact views. These are teaching records, not commercial contracts or legal advice.

`records/` is authoritative. Each file has YAML metadata and a readable description. `schema.json` validates fields, IDs, record-specific statuses, and relation names. The loader also checks unique IDs, existing targets, relation endpoint types, delivery membership, calendar dates, and dependency cycles. Invalid input fails the Astro build.

Relations are recorded once at their source. Incoming links are derived, not duplicated. Agreement coverage of a delivery is traced through its project; the interface identifies that path. Impact candidates follow recorded dependencies and project membership. They are not new asserted relationships or accepted changes.

Agreement and amendment statuses describe lifecycle; a delivery's status describes execution. `not-recorded` means unknown, not incomplete or complete. Planned dates are optional and never inferred. Proposed amendment text does not override current agreement terms.

From `site/`, run `npm run build` to parse, validate, and embed a new snapshot. Run `npm run test:contracts` for validation, transformation, source-edit, and base-path checks. No API or database is involved. Details show the source path and content hash; uncommitted changes are explicitly labelled. The source download is the original Markdown served verbatim, not generated UI data. A separate GitHub link identifies the maintained repository path; new files are available there only after commit and publication.
