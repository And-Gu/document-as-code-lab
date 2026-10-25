import { loadRefinement } from './refinement-loader';
import { loadContractExplorer } from './contract-loader';
import { relationLabels, statusScope } from './contract-model';

export interface MaterialRecord {
  kind: string; title: string; source: string; revision: string; digest: string;
  fields: { label: string; value: string }[];
  relations: { label: string; target: string; title: string; source: string }[];
  returnPath: string; returnLabel?: string;
}
// Each adapter owns its record kind. Ordinary materials do not acquire a contract schema.
const adapters = [{
  matches: (source: string) => /^examples\/information-refinement\/sources\/SRC-[A-Z-]+\.md$/.test(source),
  async load(root: string, source: string): Promise<MaterialRecord | undefined> {
    const data = await loadRefinement(root), s = data.sources.find(s => s.source === source);
    if (!s) return;
    const fields = [
      { label: 'Original-system idea', value: s.source_kind.replaceAll('_', ' ') },
      { label: 'Actual representation', value: 'Fictional, curated structured excerpt. No binary file or system connection.' },
      { label: 'Source status (teaching scenario)', value: s.source_status.replaceAll('_', ' ') },
      { label: 'Recorded date', value: s.recorded_at },
      { label: 'Owner role', value: s.owner_role },
      { label: 'Subject', value: s.subject_id ?? s.subject_external_ref! },
      { label: 'Effective from', value: s.valid_from ?? 'Not recorded' },
      { label: 'Applicable period/scope', value: s.period_start ? `${s.period_start}–${s.period_end}` : s.reporting_scope ?? 'Delivery date claim' },
      ...Object.entries(s.facts).map(([key, value]) => ({ label: `facts.${key}`, value: value === null ? 'Not available' : String(value) })),
    ];
    return { kind: 'refinement', title: `${s.id} — ${s.label}`, source, revision: s.revision, digest: s.digest, fields, relations: [], returnPath: 'materials/reference/information-refinement/', returnLabel: 'Return to Information Refinement Lab' };
  },
}, {
  matches: (source: string) => /^examples\/contract-explorer\/records\/[^/]+\.md$/.test(source),
  async load(root: string, source: string): Promise<MaterialRecord | undefined> {
    const data = await loadContractExplorer(root);
    const record = data.records.find(record => record.source === source);
    if (!record) return;
    const sentenceCase = (text: string) => text[0].toUpperCase() + text.slice(1).replaceAll('-', ' ');
    const fields = [
      { label: 'Type', value: sentenceCase(record.type) },
      { label: statusScope(record), value: sentenceCase(record.status) },
    ];
    if (record.type === 'delivery') fields.push({ label: 'Planned date', value: record.planned_date
      ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(record.planned_date))
      : 'Not recorded' });
    return {
      kind: 'contract', title: `${record.id} — ${record.label}`, source, revision: record.revision, digest: record.digest, fields,
      relations: record.relations.map(relation => {
        const target = data.records.find(item => item.id === relation.target)!;
        return { label: sentenceCase(relationLabels[relation.type]), target: target.id, title: target.label, source: target.source };
      }),
      returnPath: `chapters/09-images/?record=${encodeURIComponent(record.id)}#contract-explorer-widget`,
    };
  },
}];
export async function materialRecord(root: string, source: string) {
  return adapters.find(adapter => adapter.matches(source))?.load(root, source);
}
