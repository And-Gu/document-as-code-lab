export type RecordType = 'customer' | 'project' | 'agreement' | 'amendment' | 'delivery';
export type RelationType = 'owns' | 'applies_to' | 'belongs_to' | 'depends_on' | 'amends' | 'affects';
export interface ContractRecord {
  id: string; label: string; type: RecordType; status: string; planned_date?: string;
  relations: { type: RelationType; target: string }[];
  body: string; source: string; revision: string; digest: string;
}
export interface ContractEdge { id: string; source: string; target: string; type: RelationType; }
export interface ExplorerData { records: ContractRecord[]; edges: ContractEdge[]; builtAt: string; }
export const relationLabels: Record<RelationType, string> = {
  owns: 'owns', applies_to: 'applies to', belongs_to: 'belongs to',
  depends_on: 'depends on', amends: 'amends', affects: 'affects',
};
export function statusScope(record: ContractRecord) {
  return record.type === 'delivery' ? 'Delivery execution status'
    : record.type === 'amendment' ? 'Amendment lifecycle status'
    : record.type === 'agreement' ? 'Agreement lifecycle status' : 'Record status';
}
export function edgesFrom(records: ContractRecord[]): ContractEdge[] {
  return records.flatMap(record => record.relations.map(relation => ({
    id: `${record.id}:${relation.type}:${relation.target}`, source: record.id, ...relation,
  })));
}
export function immediateEdges(data: ExplorerData, id: string) {
  return data.edges.filter(edge => edge.source === id || edge.target === id);
}
export function deliveryCommitments(data: ExplorerData, project = '', agreement = '') {
  return data.records.filter(record => record.type === 'delivery').flatMap(delivery => {
    const membership = data.edges.find(edge => edge.source === delivery.id && edge.type === 'belongs_to')!;
    if (project && membership.target !== project) return [];
    const agreements = data.edges.filter(edge => edge.type === 'applies_to' && edge.target === membership.target)
      .map(edge => data.records.find(record => record.id === edge.source)!);
    if (agreement && !agreements.some(record => record.id === agreement)) return [];
    return [{ delivery, project: data.records.find(record => record.id === membership.target)!, agreements }];
  });
}
export function changeImpact(data: ExplorerData, id: string) {
  const direct = data.edges.filter(edge => edge.source === id);
  const directIds = new Set([id, ...direct.map(edge => edge.target)]);
  const candidates = new Map<string, { id: string; path: ContractEdge[] }>();
  const queue: { id: string; path: ContractEdge[] }[] = [];
  const enqueue = (target: string, path: ContractEdge[]) => {
    if (directIds.has(target) || candidates.has(target)) return;
    const candidate = { id: target, path }; candidates.set(target, candidate); queue.push(candidate);
  };
  for (const edge of direct) {
    if (edge.type === 'affects') queue.push({ id: edge.target, path: [edge] });
    if (edge.type === 'applies_to') {
      for (const membership of data.edges.filter(item => item.type === 'belongs_to' && item.target === edge.target)) {
        enqueue(membership.source, [edge, membership]);
      }
    }
  }
  const visited = new Set<string>();
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    for (const edge of data.edges) {
      if (edge.type === 'depends_on' && edge.target === current.id) enqueue(edge.source, [...current.path, edge]);
      if (edge.type === 'belongs_to' && edge.source === current.id) enqueue(edge.target, [...current.path, edge]);
    }
  }
  return { direct, candidates: [...candidates.values()] };
}
