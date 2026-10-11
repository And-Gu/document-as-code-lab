import { repository, repositoryUrl } from './config';
import { record, githubLink } from './github-api';
import type { Collection, DataResult } from './types';

export const snapshotKeys = ['issues', 'pulls', 'commits', 'workflows'] as const;
export type SnapshotKey = typeof snapshotKeys[number];
export type OperationalSnapshot = {
  schema_version: 1; generated_at: string; source_commit: string;
  repository: typeof repository; results: Record<SnapshotKey, DataResult<Collection>>;
};
export function parseSnapshot(value: unknown): OperationalSnapshot {
  const row = record(value), repo = record(row.repository), results = record(row.results);
  if (row.schema_version !== 1 || typeof row.generated_at !== 'string' || !Number.isFinite(Date.parse(row.generated_at)) ||
      typeof row.source_commit !== 'string' || !/^[a-f0-9]{40}$/.test(row.source_commit) ||
      repo.owner !== repository.owner || repo.name !== repository.name || repo.branch !== repository.branch) throw new Error('Invalid operational snapshot provenance');
  for (const key of snapshotKeys) {
    const result = record(results[key]);
    if (!['Published snapshot', 'Unavailable'].includes(String(result.state)) || (result.error !== undefined && typeof result.error !== 'string')) throw new Error('Invalid snapshot state');
    if (result.state === 'Unavailable') { if (result.data !== undefined) throw new Error('Invalid unavailable snapshot'); continue; }
    const data = record(result.data);
    if (typeof result.retrievedAt !== 'string' || !Number.isFinite(Date.parse(result.retrievedAt)) || typeof data.scope !== 'string' || !Array.isArray(data.items) ||
        (data.total !== undefined && (!Number.isSafeInteger(data.total) || Number(data.total) < 0))) throw new Error('Invalid snapshot collection');
    for (const value of data.items) {
      const item = record(value);
      if (!['id', 'title', 'url', 'date', 'author'].every(field => typeof item[field] === 'string') || !Array.isArray(item.labels) || !item.labels.every(label => typeof label === 'string') ||
          (item.state !== undefined && typeof item.state !== 'string') || (item.branch !== undefined && typeof item.branch !== 'string') ||
          !githubLink(item.url).startsWith(`${repositoryUrl}/`)) throw new Error('Invalid snapshot item');
    }
  }
  return value as OperationalSnapshot;
}
export async function fetchSnapshot(url: string, signal: AbortSignal, fetcher: typeof fetch = globalThis.fetch.bind(globalThis)) {
  const response = await fetcher(url, { signal, cache: 'no-store', credentials: 'omit' });
  if (!response.ok) throw new Error(`Published snapshot unavailable (${response.status}).`);
  return parseSnapshot(await response.json());
}
