# Project Control Center — Implementation Specification and Agent Prompt

## Mission

Implement an interactive, auto-refreshing Project Control Center dashboard in the existing repository `And-Gu/document-as-code-lab`. Preserve Astro, GitHub Pages, the documentation site, and current presentation and build functionality. The dashboard must display actual repository status, not mocked or Markdown-maintained dashboard content.

Read `AGENTS.md`, `site/README.md`, `site/package.json`, `site/astro.config.mjs`, `.github/workflows/deploy-pages.yml`, `.github/workflows/growth.yml`, `site/src/components/ProjectGrowth.astro`, `site/scripts/growth-report.mjs`, `scripts/measure_growth.py`, and `ROADMAP.md` before editing. Inspect existing coding, styling, base-path, testing, and deployment conventions; follow them. Do not assume this specification's suggested paths override existing conventions.

## Non-negotiable principles

1. Astro remains the main framework; no conversion to an SPA or new required hosting service.
2. GitHub Pages remains the deployment target; the dashboard works on a static host.
3. Current GitHub operational status is fetched **in the browser at runtime**, not frozen during an Astro build.
4. For expensive repository analysis, GitHub Actions may generate JSON; it must be an output artifact, never a manually edited Markdown report or a required source commit.
5. The UI clearly distinguishes `Live API`, `Measured snapshot`, `Loading`, `Stale`, and `Unavailable`. Never label build-time metrics as live.
6. No GitHub personal access tokens, GitHub Actions tokens, credentials, or secrets in client bundles, HTML, exposed JSON, or public environment variables.
7. Respect the Astro base URL (`/document-as-code-lab/`). Reuse existing URL helpers instead of hardcoding root-relative asset links.
8. Accessible, responsive, progressively enhanced; failures in one widget must not break other widgets.
9. Avoid large dependencies unless justified. Chart.js is already installed; prefer Astro, TypeScript, and the existing styles.
10. Do not change documentation Markdown to display dashboard results. Keep the educational Chapter 3 growth widget functioning.

## Release 1 — Live GitHub operations

Create `/dashboard/` within the existing Astro site. Implement these widgets, populated from real GitHub REST API responses:

- **Open issues**: count and small list with title, updated time, labels, and links. Exclude pull requests from the Issues endpoint; account for pagination, since the Issues endpoint may include PRs.
- **Open pull requests**: count and list with title, author, update time, and links.
- **Recent commits on `main`**: latest commit SHA, message, author where available, date, and link.
- **Workflow status**: latest runs for repository workflows, conclusion/status, branch, timestamps and links to individual runs. Distinguish running, queued, success, failure, cancelled, and unknown; never equate `completed` with success.
- **Activity**: a concise chronologically ordered feed of the items above, with direct links to GitHub. Label it as a limited activity feed, not an exhaustive audit log.
- **Repository links**: useful navigation to repo, Actions, Issues, and PRs.

Interactions:

- Fetch when dashboard opens, then refresh periodically while page is visible (suggested 120-second interval) and allow manual Refresh.
- Allow filtering the issue/PR lists by at least text; provide simple activity type filters if practical.
- Display last successful retrieval time and per-widget loading/error state; indicate that API data may be cached or delayed.
- If rate limited, offline, or the API request fails, keep the last successful data in memory and visibly mark it stale, with a Retry control. Never show zero for an API failure.
- Use `AbortController`/cleanup to prevent duplicate in-flight requests on navigation or component teardown. Pause interval polling when the tab is hidden; resume/refetch on visibility restoration.

Implementation considerations:

- Repository: `And-Gu/document-as-code-lab`; default branch `main`. Centralize these values in configuration.
- Use GitHub REST API with descriptive headers and careful error handling; anonymous access is limited, so avoid excessive calls and redundant requests.
- GitHub public endpoints need no browser token. If a future private GitHub Enterprise repo needs authenticated access, design a replaceable data adapter or secure server-side proxy, rather than exposing a token in JavaScript.
- Query pagination correctly, avoid misleading total counts from `per_page=100`, and document the scope of any display limit. Suitable API endpoints include `/repos/{owner}/{repo}/issues`, `/pulls`, `/commits`, `/actions/runs` and optionally `/actions/workflows`.
- Prefer type-safe normalized data models (`Issue`, `PullRequest`, `Commit`, `WorkflowRun`, `DataResult`) separate from the presentation layer.
- Keep timestamps in UTC internally and render local/relative timestamps with accessible absolute dates.

## Release 2 — Growth and calculated metrics

Leverage existing `scripts/measure_growth.py`, `site/scripts/growth-report.mjs`, and the Chart.js implementation used by `ProjectGrowth.astro` rather than replacing them.

Publish a stable, versioned JSON metrics schema, ideally under `site/public/data/project-metrics.json` during the build (generated, not committed). It should include:

- `schema_version` and `measurement_version`;
- `generated_at`;
- `source_commit` and `source_committed_at`;
- `history` containing relevant existing counts by commit (word count, chapter count, draft/complete chapter count, complete capabilities), with source commit and commit date.

The browser fetches JSON at runtime using a base-aware URL and `cache: 'no-store'` or an equivalent cache strategy. It may refresh this resource without reloading the page, but it must display `Measured snapshot` and the generated/source times. Compare the measured source commit to the latest `main` commit, if possible, and show a clear lag indicator when behind. Existing git-history measurements are historical snapshots, not instant GitHub API metrics.

For the initial release, publishing the JSON as part of the current Pages deployment is acceptable, with the explicit limitation that new metrics are only available after deployment completes. Document a future option to publish the dataset independently if required. Do not upload only an Actions artifact and assume public Pages clients can fetch it. Preserve the existing Chapter 3 widget and its built-in historical chart.

Add a growth chart with selectable measures, revision-range comparison, clear axis labels, data provenance, and an accessible data table. Reuse installed Chart.js.

## Suggested file layout (adapt to repository conventions)

```text
site/src/pages/dashboard/index.astro
site/src/components/dashboard/
site/src/lib/dashboard/github-api.ts
site/src/lib/dashboard/metrics-api.ts
site/src/lib/dashboard/types.ts
site/src/styles/dashboard.css
site/public/data/project-metrics.json         # generated by build; not edited by hand
site/scripts/                                  # existing growth generator, minimally adapted
```

Avoid committing generated JSON unless a deliberate architectural need is documented. Ensure `.gitignore` and build behavior are consistent with how GitHub Actions checks out and builds the site.

## Acceptance criteria

### Release 1

- [ ] Dashboard is served at `/document-as-code-lab/dashboard/` on GitHub Pages.
- [ ] On opening the page, operational metrics come from live browser GitHub API calls (verify in browser Network tab), without a Pages rebuild.
- [ ] Refresh updates the displayed results without reloading the page.
- [ ] PRs are not counted as issues.
- [ ] API failures and rate limits show a clear error or stale state, never a fabricated zero.
- [ ] Running, failed, and successful workflow runs are distinguished.
- [ ] Every displayed repository item has a functional link to its GitHub source.
- [ ] The page works on mobile and with keyboard navigation; loading updates are announced accessibly.
- [ ] The rest of the existing Astro site builds and continues working.

### Release 2

- [ ] Generated JSON is reachable on deployed Pages through the correct project base path.
- [ ] Metrics are produced automatically from existing project sources without editing Markdown or committing output back to `main`.
- [ ] The dashboard labels generated measurements and shows source commit, generation date, and stale/lag state.
- [ ] Existing Chapter 3 growth widget continues working.
- [ ] Growth chart changes interactively and has an accessible tabular equivalent.
- [ ] API or metrics-fetch failure doesn't break the other dashboard areas.

## Verification

- Run existing tests plus `npm --prefix site run check` and `npm --prefix site run build`, as applicable in this repository.
- Add focused tests for API response normalization, pagination/counting assumptions, error/stale states, URL base handling, and metrics schema.
- Test the built site through the GitHub Pages subpath, not only at `/` in Astro dev mode.
- Test browser-refresh behavior and failure modes with network unavailable and API rate limiting.
- Check for secrets in generated output; do not use credentials in browser fetches.
- Provide an implementation summary, files changed, local commands, screenshots or test evidence where available, and any explicit limitations.

## Execution instructions for coding agent

1. Inspect the listed files and existing conventions.
2. Implement and verify **Release 1 first**, keeping its work in manageable changes.
3. Implement **Release 2**, reusing existing measurements and charts, without disrupting the chapter example.
4. Run tests/build and fix problems, then report only verified outcomes.
5. Do not silently expand scope to React, a database, a private backend, GitHub Projects, or WebSockets. Propose those separately only when concrete requirements justify them.

## Future extensions (not required in this implementation)

- GitHub Projects item status, with an authenticated backend or automation integration if required.
- Broken links, documentation metadata validation, change-request lead times, review cycle times, and traceability metrics.
- Repository-agnostic configuration and enterprise-hosted GitHub API adapters.
- Webhook-driven push updates using a backend service where actual event-level real time is necessary.
