import { apiRoot, repository } from './config';
import type { Collection, Item } from './types';

type RecordValue = Record<string, unknown>;
export function record(value: unknown): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Unexpected API response');
  return value as RecordValue;
}
const string = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
export function githubLink(value: unknown): string {
  const url = new URL(string(value));
  if (url.origin !== 'https://github.com') throw new Error('Unexpected GitHub link');
  return url.href;
}
export function normalizeIssue(value: unknown): Item {
  const row = record(value);
  return { id: String(row.number), title: string(row.title), url: githubLink(row.html_url),
    date: string(row.updated_at), author: row.user ? string(record(row.user).login, 'Unknown') : 'Unknown',
    labels: Array.isArray(row.labels) ? row.labels.map(label => typeof label === 'string' ? label : string(record(label).name)) : [] };
}
export function normalizeCommit(value: unknown): Item {
  const row = record(value), commit = record(row.commit), author = record(commit.author ?? {}), committer = record(commit.committer ?? {});
  return { id: string(row.sha), title: string(commit.message).split('\n')[0], url: githubLink(row.html_url),
    date: string(committer.date, string(author.date)), author: string(author.name, 'Unknown'), labels: [] };
}
export function workflowState(status: unknown, conclusion: unknown): string {
  if (status === 'in_progress') return 'running';
  if (['queued', 'waiting', 'requested', 'pending'].includes(String(status))) return 'queued';
  if (status !== 'completed') return 'unknown';
  if (['success', 'failure', 'cancelled', 'skipped', 'neutral', 'timed_out', 'action_required', 'stale'].includes(String(conclusion))) return String(conclusion);
  return 'unknown';
}
export function normalizeRun(value: unknown): Item {
  const row = record(value);
  return { id: String(row.id), title: string(row.name, 'Workflow'), url: githubLink(row.html_url),
    date: string(row.updated_at), author: '', labels: [], branch: string(row.head_branch, 'Unknown'), state: workflowState(row.status, row.conclusion) };
}
export class GitHubApi {
  remaining = 60;
  resetAt = 0;
  retryAt = 0;
  constructor(private fetcher: typeof fetch = globalThis.fetch.bind(globalThis)) {}
  async request(url: string, signal: AbortSignal): Promise<{ body: unknown; next?: string }> {
    if (!url.startsWith(`${apiRoot}/`)) throw new Error('Unexpected pagination URL');
    if (Date.now() < this.retryAt) throw new Error(`API rate limited. Retry after ${new Date(this.retryAt).toLocaleTimeString()}.`);
    const response = await this.fetcher(url, { signal, credentials: 'omit', headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } });
    const remaining = response.headers.get('x-ratelimit-remaining');
    if (remaining !== null) this.remaining = Number(remaining);
    const reset = response.headers.get('x-ratelimit-reset');
    if (reset) this.resetAt = Number(reset) * 1000;
    if (!response.ok) {
      if (response.status === 429 || (response.status === 403 && (this.remaining === 0 || response.headers.has('retry-after')))) {
        this.retryAt = this.remaining === 0 && reset ? this.resetAt + 1000 : Date.now() + Number(response.headers.get('retry-after') ?? 60) * 1000;
        throw new Error(`API rate limited. Retry after ${new Date(this.retryAt).toLocaleTimeString()}.`);
      }
      throw new Error(`GitHub request failed (${response.status}). Retry to retrieve data.`);
    }
    const next = response.headers.get('link')?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
    return { body: await response.json(), next };
  }
  async pages(endpoint: string, signal: AbortSignal, key?: string): Promise<unknown[]> {
    let url: string | undefined = `${apiRoot}/${endpoint}`;
    const rows: unknown[] = [];
    const visited = new Set<string>();
    while (url) {
      if (visited.has(url) || visited.size >= 20) throw new Error('Pagination exceeded the request budget. Total unavailable.');
      visited.add(url);
      const response = await this.request(url, signal);
      const page = key ? record(response.body)[key] : response.body;
      if (!Array.isArray(page)) throw new Error('Unexpected API list response');
      rows.push(...page);
      url = response.next;
    }
    return rows;
  }
  async issues(signal: AbortSignal): Promise<Collection> {
    const rows = await this.pages('issues?state=open&sort=updated&direction=desc&per_page=100', signal);
    const items = rows.filter(row => !record(row).pull_request).map(normalizeIssue);
    return { items, total: items.length, scope: 'All open issues; pull requests excluded. List shows up to 10 matches.' };
  }
  async pulls(signal: AbortSignal): Promise<Collection> {
    const items = (await this.pages('pulls?state=open&sort=updated&direction=desc&per_page=100', signal)).map(normalizeIssue);
    return { items, total: items.length, scope: 'All open pull requests. List shows up to 10 matches.' };
  }
  async commits(signal: AbortSignal): Promise<Collection> {
    const { body } = await this.request(`${apiRoot}/commits?sha=${repository.branch}&per_page=10`, signal);
    if (!Array.isArray(body)) throw new Error('Unexpected commit response');
    return { items: body.map(normalizeCommit), scope: `Latest 10 commits on ${repository.branch}.` };
  }
  async workflows(signal: AbortSignal): Promise<Collection> {
    const workflows = await this.pages('actions/workflows?per_page=100', signal, 'workflows');
    const items: Item[] = [];
    for (const value of workflows) {
      const workflow = record(value);
      const { body } = await this.request(`${apiRoot}/actions/workflows/${workflow.id}/runs?per_page=1`, signal);
      const runs = record(body).workflow_runs;
      if (!Array.isArray(runs)) throw new Error('Unexpected workflow response');
      if (runs[0]) items.push(normalizeRun(runs[0]));
      else items.push({ id: `workflow-${workflow.id}`, title: string(workflow.name), url: githubLink(workflow.html_url), date: '', author: '', labels: [], state: 'unknown', branch: 'No runs yet' });
    }
    return { items, scope: 'Latest run for each repository workflow, across branches. Workflows with no runs are marked unknown.' };
  }
  pollingDelay(): number {
    return Math.max(120_000, this.retryAt - Date.now(), this.remaining < 10 ? this.resetAt - Date.now() + 1000 : (this.resetAt - Date.now()) * 8 / Math.max(1, this.remaining));
  }
}
