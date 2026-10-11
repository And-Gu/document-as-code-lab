export type Item = { id: string; title: string; url: string; date: string; author: string; labels: string[]; state?: string; branch?: string };
export type Issue = Item;
export type PullRequest = Item;
export type Commit = Item;
export type WorkflowRun = Item;
export type Collection = { items: Item[]; total?: number; scope: string };
export type DataResult<T> = { data?: T; retrievedAt?: string; state: 'Loading' | 'Live API' | 'Published snapshot' | 'Measured snapshot' | 'Stale' | 'Unavailable'; error?: string };
export function failed<T>(previous: DataResult<T>, error: string): DataResult<T> {
  return { ...previous, state: previous.data ? 'Stale' : 'Unavailable', error };
}
