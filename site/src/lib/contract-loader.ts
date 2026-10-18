import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import Ajv from 'ajv';
import { parseDocument } from 'yaml';
import { edgesFrom, type ContractRecord, type ExplorerData, type RelationType } from './contract-model';

const endpointTypes: Record<RelationType, [string, string]> = {
  owns: ['customer', 'project'], applies_to: ['agreement', 'project'],
  belongs_to: ['delivery', 'project'], depends_on: ['delivery', 'delivery'],
  amends: ['amendment', 'agreement'], affects: ['amendment', 'delivery'],
};
export function validateContractRecords(records: ContractRecord[], schema: object) {
  const validate = new Ajv({ allErrors: true }).compile(schema);
  const byId = new Map<string, ContractRecord>();
  for (const record of records) {
    const { body, source, revision, digest, ...metadata } = record;
    if (!validate(metadata)) throw new Error(`${source}: ${JSON.stringify(validate.errors)}`);
    if (byId.has(record.id)) throw new Error(`Duplicate ID: ${record.id}`);
    if (!body.trim()) throw new Error(`${record.id}: description is required`);
    if (record.planned_date && (Number.isNaN(Date.parse(record.planned_date)) || new Date(record.planned_date).toISOString().slice(0, 10) !== record.planned_date)) {
      throw new Error(`${record.id}: invalid planned date`);
    }
    byId.set(record.id, record);
  }
  const seen = new Set<string>();
  for (const edge of edgesFrom(records)) {
    const target = byId.get(edge.target), source = byId.get(edge.source)!;
    if (!target) throw new Error(`${edge.source}: unknown target ${edge.target}`);
    const types = endpointTypes[edge.type];
    if (source.type !== types[0] || target.type !== types[1]) throw new Error(`${edge.id}: invalid relation endpoints`);
    if (edge.source === edge.target || seen.has(edge.id)) throw new Error(`${edge.id}: self or duplicate relation`);
    seen.add(edge.id);
  }
  for (const record of records.filter(record => record.type === 'delivery')) {
    if (record.relations.filter(relation => relation.type === 'belongs_to').length !== 1) throw new Error(`${record.id}: exactly one project is required`);
  }
  const visiting = new Set<string>(), visited = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) throw new Error(`${id}: dependency cycle`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const relation of byId.get(id)!.relations.filter(relation => relation.type === 'depends_on')) visit(relation.target);
    visiting.delete(id); visited.add(id);
  }
  for (const id of byId.keys()) visit(id);
}

export async function loadContractExplorer(root: string): Promise<ExplorerData> {
  const directory = path.join(root, 'examples/contract-explorer');
  const schema = JSON.parse(await readFile(path.join(directory, 'schema.json'), 'utf8'));
  const names = (await readdir(path.join(directory, 'records'))).filter(name => name.endsWith('.md')).sort();
  if (!names.length) throw new Error('Contract Explorer has no source records');
  const records = await Promise.all(names.map(async name => {
    const source = `examples/contract-explorer/records/${name}`;
    const raw = await readFile(path.join(root, source), 'utf8');
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
    if (!match) throw new Error(`${source}: YAML frontmatter is required`);
    const document = parseDocument(match[1], { uniqueKeys: true });
    if (document.errors.length || document.warnings.length) throw new Error(`${source}: invalid YAML: ${[...document.errors, ...document.warnings].map(error => error.message).join('; ')}`);
    const metadata = document.toJS({ maxAliasCount: 20 });
    if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') throw new Error(`${source}: metadata must be a mapping`);
    const digest = createHash('sha256').update(raw).digest('hex');
    let revision = 'Uncommitted working copy';
    try {
      const committed = execFileSync('git', ['show', `HEAD:${source}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      if (committed === raw) revision = execFileSync('git', ['log', '-1', '--format=%H', '--', source], { cwd: root, encoding: 'utf8' }).trim();
    } catch { /* New records still have a content hash before their first commit. */ }
    return { ...metadata, body: match[2].trim(), source, revision, digest } as ContractRecord;
  }));
  validateContractRecords(records, schema);
  return { records, edges: edgesFrom(records), builtAt: new Date().toISOString() };
}
