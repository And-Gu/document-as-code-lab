import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import Ajv from 'ajv';
import { parseDocument } from 'yaml';
import { loadContractExplorer } from './contract-loader';
import { calendarDay, type Claim, type EvidenceSource, type RefinementData } from './refinement-model';
const base = 'examples/information-refinement/';
export async function readRefinementFile(root: string, source: string) {
  const raw = await readFile(path.join(root, source), 'utf8');
  let revision = 'Uncommitted working copy';
  try {
    const committed = execFileSync('git', ['show', `HEAD:${source}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    if (committed === raw) revision = execFileSync('git', ['log', '-1', '--format=%H', '--', source], { cwd: root, encoding: 'utf8' }).trim();
  } catch { /* Exact digest identifies new and modified inputs. */ }
  return { raw, source, revision, digest: createHash('sha256').update(raw).digest('hex') };
}
export async function loadRefinement(root: string): Promise<RefinementData> {
  const manifests = await Promise.all(['scenario.json', 'identity-map.json', 'schema.json', 'catalogue.json'].map(name => readRefinementFile(root, base + name)));
  const scenario = JSON.parse(manifests[0].raw), identity = JSON.parse(manifests[1].raw);
  calendarDay(scenario.as_of);
  if (scenario.schema_version !== 1 || scenario.fictional !== true || !Array.isArray(scenario.new_source_paths) || !Array.isArray(identity.mappings)) throw new Error('Invalid refinement manifest');
  const contract = await loadContractExplorer(root);
  const deliveryPointer = scenario.existing_entities?.find((e: { role: string }) => e.role === 'delivery_identity_and_recorded_plan');
  const delivery = contract.records.find(r => r.id === deliveryPointer?.id && r.source === deliveryPointer?.repository_path && r.type === 'delivery')!;
  const project = contract.records.find(r => r.id === delivery?.relations.find(rel => rel.type === 'belongs_to')?.target)!;
  if (!delivery || !project) throw new Error('Refinement needs the existing delivery and its recorded project');
  const validate = new Ajv({ allErrors: true }).compile<Omit<EvidenceSource, 'body' | 'source' | 'revision' | 'digest'>>(JSON.parse(manifests[2].raw));
  const sources: EvidenceSource[] = await Promise.all(scenario.new_source_paths.map(async (source: string) => {
    if (!/^examples\/information-refinement\/sources\/SRC-[A-Z-]+\.md$/.test(source)) throw new Error('Source outside the refinement fixture directory');
    const { raw, ...provenance } = await readRefinementFile(root, source);
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
    if (!match) throw new Error(`${source}: frontmatter required`);
    const doc = parseDocument(match[1], { uniqueKeys: true });
    if (doc.errors.length || doc.warnings.length) throw new Error(`${source}: invalid YAML`);
    const metadata = doc.toJS({ maxAliasCount: 20 });
    if (!validate(metadata)) throw new Error(`${source}: ${JSON.stringify(validate.errors)}`);
    if (path.basename(source, '.md') !== metadata.id) throw new Error(`${source}: source ID must match filename`);
    for (const key of ['recorded_at', 'valid_from', 'period_start', 'period_end'] as const) if (metadata[key]) calendarDay(metadata[key]);
    if (metadata.period_start && (!metadata.period_end || metadata.period_end < metadata.period_start)) throw new Error(`${source}: invalid period`);
    if (metadata.subject_id && !contract.records.some(r => r.id === metadata.subject_id)) throw new Error(`${source}: unknown subject`);
    for (const [key, value] of Object.entries(metadata.facts)) if (key.endsWith('_date') && value !== null) calendarDay(String(value));
    return { ...metadata, ...provenance, body: match[2].trim() };
  }));
  if (new Set(sources.map(s => s.id)).size !== sources.length) throw new Error('Duplicate refinement source ID');
  const mappingKeys = new Set();
  for (const m of identity.mappings) {
    const key = `${m.source_id}:${m.external_ref}`;
    if (mappingKeys.has(key) || !sources.some(s => s.id === m.source_id && s.subject_external_ref === m.external_ref) || m.canonical_id !== delivery.id || !m.basis || !m.external_label) throw new Error('Invalid or ambiguous identity mapping');
    mappingKeys.add(key);
  }
  const claims: Claim[] = sources.flatMap(s => Object.entries(s.facts).filter(([key]) => !['currency', 'minor_units_per_major'].includes(key)).map(([predicate, value]) => ({
    subject: s.subject_id ?? s.subject_external_ref!, predicate, value,
    unit: predicate.endsWith('_minor') ? `minor:${s.facts.currency ?? 'unknown'}:${s.facts.minor_units_per_major ?? 'unknown'}` : predicate.endsWith('_hours') ? 'hours' : predicate.endsWith('_date') ? 'calendar date' : 'evidence',
    scope: s.reporting_scope ?? 'delivery',
    // A project-total comparison is cumulative in this snapshot, not an invented monthly period.
    period: s.period_start && s.period_end ? `${s.period_start}–${s.period_end}` : s.reporting_scope === 'project_total' ? `project total recorded ${s.recorded_at}` : '',
    sourceId: s.id, field: `facts.${predicate}`, validFrom: s.valid_from,
  })));
  return { scenario, sources, claims, mappings: identity.mappings, delivery, project, manifests: manifests.map(({ raw: _, ...p }) => p) };
}
export interface CatalogueEntry { title: string; purpose: string; use: string; example: string; path: string; kind: string; scope: string; owner: string; date: string; status: string; caveat: string; }
export async function loadCatalogue(root: string, data: RefinementData): Promise<CatalogueEntry[]> {
  const manifest = JSON.parse((await readRefinementFile(root, base + 'catalogue.json')).raw);
  return Promise.all(manifest.map(async (entry: Pick<CatalogueEntry, 'title' | 'purpose' | 'use' | 'example' | 'path'>) => {
    const s = data.sources.find(s => s.source === entry.path);
    if (s) return { ...entry, kind: s.source_kind.replaceAll('_', ' '), scope: s.subject_id ?? s.subject_external_ref!, owner: s.owner_role, date: s.recorded_at, status: s.source_status.replaceAll('_', ' '), caveat: s.body };
    if (entry.path === data.delivery.source) return { ...entry, title: `${data.delivery.id} — ${data.delivery.label}`, kind: 'Delivery record', scope: data.project.id, owner: 'Not recorded', date: data.delivery.planned_date ? `Recorded plan: ${data.delivery.planned_date}` : 'Not recorded', status: `Delivery execution status: ${data.delivery.status}`, caveat: 'Not a customer commitment or completion evidence.' };
    if (entry.path !== 'reference/ai-context-and-agents.md') throw new Error('Unregistered catalogue entry');
    await readFile(path.join(root, entry.path));
    return { ...entry, kind: 'Reference guide', scope: 'Project knowledge', owner: 'Not recorded', date: 'Not recorded', status: 'Explanatory guide; not an access grant', caveat: 'A task still needs authorized tools and human review.' };
  }));
}
