# PDF Design Trial

This is a small proof, not the full book pipeline. It reads selected excerpts from chapters 1, 5, and 10, renders the maintained onboarding diagram as SVG, and builds a native table from the CSSV budget values. Whole-page SVG export is out of scope.

## Local Tools

From the repository root, using the existing Python environment:

First create `.venv` and install the root `requirements.txt` as described in the repository README. The PDF tools are optional and separate from Astro; Node 22.12 or newer is recommended for the shared workspace. Run the following shell commands on macOS/Linux (Windows requires equivalent environment-variable syntax).

```sh
.venv/bin/python -m pip install --target build/pdf-tools -r publishing/pdf/requirements.txt
npm ci --prefix publishing/pdf --ignore-scripts
```

Mermaid CLI needs a compatible Chrome/Chromium executable. Set `PUPPETEER_EXECUTABLE_PATH` to an existing compatible browser, or install Puppeteer's headless shell locally:

```sh
cd publishing/pdf
PUPPETEER_CACHE_DIR=../../build/puppeteer npm exec -- puppeteer browsers install chrome-headless-shell
cd ../..
```

Use the absolute executable path printed by that command:

```sh
PUPPETEER_EXECUTABLE_PATH=/absolute/path/to/chrome-headless-shell \
  PYTHONPATH=build/pdf-tools .venv/bin/python scripts/build_pdf_proof.py
```

The pinned Python packages bundle Pandoc and the Typst compiler binding; no global install is needed. The lock file pins Mermaid CLI dependencies. Browser compatibility remains an additional environment requirement.

### Restricted Environments

The first trial could not launch Chromium through Mermaid CLI in the Codex process sandbox. Its SVG was instead rendered with the installed Mermaid library in the permitted in-app browser, with the same configuration. The PDF was then built using:

```sh
PYTHONPATH=build/pdf-tools .venv/bin/python scripts/build_pdf_proof.py \
  --prepared-svg build/pdf-proof/onboarding.svg
```

This option accepts a prepared asset and records that fact and its hash in the manifest. It does not verify that an arbitrary supplied SVG matches the Mermaid source; inspect that relationship. The normal CLI path still needs an end-to-end check in an environment that permits launching Chromium. The browser-assisted proof is not a verified automated pipeline.

## Automated Review Build

The `PDF design proof` workflow in `.github/workflows/pdf-proof.yml` runs on pull requests to `main` and can be started manually from GitHub's Actions tab once the workflow is on the default branch. It is separate from Astro and does not deploy to Pages, commit generated files, or publish an approved edition. There is no push-to-main trigger yet.

The Ubuntu 22.04 runner installs the locked Mermaid CLI dependencies and Puppeteer's matching Chrome browser with its sandbox enabled. It installs the pinned Pandoc/Typst Python packages and Poppler inspection tools, runs the focused tests, then calls `scripts/build_pdf_proof.py` without `--prepared-svg`.

`scripts/verify_pdf_proof.py` requires Mermaid CLI provenance, matching source and SVG hashes, native SVG labels and shapes, three PDF pages, expected searchable metadata and budget values, and no raster images. It records font information for review. These are checks for this particular proof, not a general publication validator.

Open a successful workflow run and download its `pdf-design-proof-<commit>` artifact. It contains the PDF, diagram, manifest, verification report, and page PNGs for visual inspection. Artifacts are retained for 14 days; they are review copies, not permanent releases. A pull-request run measures GitHub's test merge revision, which may differ from the branch's latest commit.

The workflow still needs its first successful hosted run and visual review before automated rendering can be recorded as verified. Fork pull requests may require a maintainer to approve the workflow run. No deployment secrets or write token are needed.

## Inputs and Outputs

- `template.typ` controls page layout, metadata blocks, fonts, and table defaults.
- `mermaid.json` disables HTML labels for SVG compatibility with the PDF engine.
- `scripts/build_pdf_proof.py` selects blocks from Pandoc's parsed Markdown, rather than keeping copied chapter prose.
- The CSSV data supplies the budget table. Its browser CSS is deliberately replaced by native print styling; variance values are validated, not silently recalculated.
- `build/pdf-proof/` contains the PDF, intermediate Typst and SVG files, and an input-hash manifest. All remain ignored by Git.

The manifest labels working-tree changes explicitly. This trial is not a released or approved edition. The current source-selection rules are deliberately limited: arbitrary Markdown links, example markers, every diagram type, full-book cross-references, and long tables need further work.

## Review

Render every PDF page to PNG with `pdftoppm` and inspect it. Use `pdftotext`, `pdffonts`, and `pdfimages -list` to check text extraction, fonts, and accidental rasterization. These checks do not establish PDF/UA compliance. Preserve meaningful chapter statuses and review the assembled publication separately.

Run focused source-selection and conversion tests from the repository root:

```sh
PYTHONPATH=build/pdf-tools .venv/bin/python -m unittest discover -s publishing/pdf -p 'test_*.py'
```

The initial proof was visually checked on all three A4 pages. Text extraction confirmed the metadata and budget values; inspection found no raster images. This is not an accessibility certification. Prepared SVGs, generated PDFs, and local tool installations stay under ignored `build/` and are not included in a fresh clone.

The planned chapter outline is in `reference/pdf-publication.md`.
