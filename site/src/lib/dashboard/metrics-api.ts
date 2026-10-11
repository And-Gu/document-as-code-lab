export const measures = [
  ['word_count', 'Prose words'], ['chapter_count', 'Chapter files'],
  ['draft_or_complete_chapters', 'Draft or complete chapters'], ['complete_features', 'Completed capabilities'],
] as const;
export type Metric = typeof measures[number][0];
export type Snapshot = { source_commit: string; committed_at: string } & Record<Metric, number | null>;
export type Metrics = { schema_version: number; measurement_version: number; generated_at: string; source_commit: string; source_committed_at: string; history: Snapshot[] };
const validDate = (value: unknown) => typeof value === 'string' && !Number.isNaN(Date.parse(value));
const sha = (value: unknown) => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
export function parseMetrics(value: unknown): Metrics {
  if (!value || typeof value !== 'object') throw new Error('Invalid metrics schema');
  const data = value as Metrics;
  if (data.schema_version !== 1 || !Number.isInteger(data.measurement_version) || data.measurement_version < 1 || !sha(data.source_commit) || !validDate(data.generated_at) || !validDate(data.source_committed_at) || !Array.isArray(data.history) || !data.history.length) throw new Error('Unsupported or invalid metrics schema');
  for (const row of data.history) {
    if (!row || !sha(row.source_commit) || !validDate(row.committed_at)) throw new Error('Invalid metrics revision');
    for (const [field] of measures) {
      if (field === 'complete_features' && row[field] === null) continue;
      if (!Number.isInteger(row[field]) || Number(row[field]) < 0) throw new Error('Invalid metric count');
    }
  }
  const latest = data.history.at(-1)!;
  if (latest.source_commit !== data.source_commit || latest.committed_at !== data.source_committed_at) throw new Error('Metrics provenance does not match history');
  return data;
}
export async function fetchMetrics(url: string, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<Metrics> {
  const response = await fetcher(url, { signal, cache: 'no-store', credentials: 'omit' });
  if (!response.ok) throw new Error(`Measurements unavailable (${response.status})`);
  return parseMetrics(await response.json());
}
export function lagMessage(source: string, latest?: string): string {
  return !latest ? 'Latest main revision unavailable; lag cannot be checked.' : source === latest ? 'Measured revision matches the latest retrieved main commit.' : `Snapshot differs from latest main (${latest.slice(0, 7)}); a newer deployment may be pending.`;
}
