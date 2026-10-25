// Browser-safe, deterministic transformations. Source text is never interpreted as instructions.
export interface EvidenceSource {
  id: string; label: string; source_kind: string; source_status: string; owner_role: string;
  recorded_at: string; valid_from?: string; period_start?: string; period_end?: string;
  subject_id?: string; subject_external_ref?: string; reporting_scope?: string;
  facts: Record<string, string | number | null>; body: string; source: string; revision: string; digest: string;
}
export interface Claim {
  subject: string; predicate: string; value: string | number | null; unit: string;
  scope: string; period: string; sourceId: string; field: string; validFrom?: string;
}
export interface Mapping { source_id: string; external_ref: string; external_label: string; canonical_id: string; basis: string; }
export interface RefinementData {
  scenario: { scenario_id: string; as_of: string; rule_version: string };
  sources: EvidenceSource[]; claims: Claim[]; mappings: Mapping[];
  delivery: { id: string; label: string; planned_date?: string; status: string; source: string; revision: string; digest: string };
  project: { id: string; label: string };
  manifests: { source: string; revision: string; digest: string }[];
}
export interface Practice { mapping: boolean; forecast: string; excluded: string[]; }
export interface Finding {
  id: string; title: string; state: 'recorded' | 'derived' | 'proposed' | 'unavailable' | 'conflicting';
  text: string; rule: string; inputs: Claim[]; question: string;
}
export interface Result {
  findings: Finding[]; practice: Practice; asOf: string; ruleVersion: string;
  comparisonDays: number | null; capacityGap: number | null; budgetVariance: number | null;
}
export const initialPractice = (): Practice => ({ mapping: false, forecast: '', excluded: [] });
export function calendarDay(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Use a real calendar date in YYYY-MM-DD format.');
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value) throw new Error('Use a real calendar date in YYYY-MM-DD format.');
  return date.valueOf() / 86400000;
}
export function dateLabel(value: string) {
  calendarDay(value);
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}
export function validatePractice(data: RefinementData, input: Practice) {
  if (!input || typeof input.mapping !== 'boolean' || typeof input.forecast !== 'string' || !Array.isArray(input.excluded) || input.excluded.some(id => !data.sources.some(s => s.id === id))) throw new Error('Unknown practice input. Reset the exercise.');
  if (input.forecast) calendarDay(input.forecast);
}
export function deriveRefinement(data: RefinementData, practice: Practice): Result {
  validatePractice(data, practice);
  const asOf = calendarDay(data.scenario.as_of);
  const findings: Finding[] = [];
  const sources = new Map(data.sources.map(s => [s.id, s]));
  const included = data.claims.filter(c => !practice.excluded.includes(c.sourceId));
  const claims = included.map(c => {
    if (!sources.has(c.sourceId)) throw new Error(`Unknown source ${c.sourceId}`);
    if (c.predicate.endsWith('_date') && c.value !== null) calendarDay(String(c.value));
    if (typeof c.value === 'number' && (!Number.isFinite(c.value) || c.value < 0 || (c.unit.startsWith('minor:') && !Number.isSafeInteger(c.value)))) throw new Error('Invalid numeric source value.');
    const mapping = data.mappings.find(m => m.source_id === c.sourceId && m.external_ref === c.subject);
    return { ...c, subject: practice.mapping && mapping ? mapping.canonical_id : c.subject,
      value: c.sourceId === 'SRC-FORECAST' && c.predicate === 'forecast_date' && practice.forecast ? practice.forecast : c.value };
  });
  const add = (id: string, title: string, state: Finding['state'], text: string, rule: string, inputs: Claim[], question: string) => findings.push({ id, title, state, text, rule, inputs, question });
  // Every candidate is retained as evidence; conflicts are never settled by timestamp.
  function pick(predicate: string, subject: string) {
    const all = claims.filter(c => c.predicate === predicate && c.subject === subject);
    const active = all.filter(c => (predicate !== 'customer_commitment_date' || sources.get(c.sourceId)!.source_status === 'approved_in_fictional_scenario') && (!c.validFrom || calendarDay(c.validFrom) <= asOf) && calendarDay(sources.get(c.sourceId)!.recorded_at) <= asOf && c.value !== null);
    const values = new Set(active.map(c => JSON.stringify([c.value, c.unit, c.scope, c.period])));
    const groups = new Map<string, Set<string>>();
    for (const c of active) {
      const key = JSON.stringify([c.unit, c.scope, c.period]);
      const group = groups.get(key) ?? new Set<string>(); group.add(JSON.stringify(c.value)); groups.set(key, group);
    }
    return { all, claim: values.size === 1 ? active[0] : undefined, conflict: [...groups.values()].some(group => group.size > 1) };
  }
  const plan: Claim = { subject: data.delivery.id, predicate: 'planned_date', value: data.delivery.planned_date ?? null, unit: 'calendar date', scope: 'repository snapshot', period: '', sourceId: data.delivery.id, field: 'planned_date' };
  add('plan', 'Recorded plan in the repository snapshot', 'recorded', plan.value ? dateLabel(String(plan.value)) : 'Not available', 'recorded-plan', [plan], 'Does this older recorded plan need review? It is not a commitment, forecast or completion evidence.');
  const dates = [
    ['commitment', 'Stated customer commitment', 'customer_commitment_date'],
    ['forecast', 'Planning forecast', 'forecast_date'],
    ['proposal', 'Proposed change', 'proposed_date'],
  ];
  for (const [id, title, predicate] of dates) {
    const selected = pick(predicate, data.delivery.id);
    const unresolved = predicate === 'forecast_date' && !practice.mapping && claims.some(c => c.predicate === predicate && c.subject !== data.delivery.id);
    const evidence = unresolved ? claims.filter(c => c.predicate === predicate) : selected.all;
    add(id, title, selected.conflict ? 'conflicting' : selected.claim ? (id === 'proposal' ? 'proposed' : 'recorded') : 'unavailable',
      selected.conflict ? 'Conflicting comparable claims; no single date selected.' : selected.claim ? `${dateLabel(String(selected.claim.value))}${id === 'proposal' ? ' proposed; approval is not established by this calculation.' : ''}` : unresolved ? 'Identity unresolved: inspect the IP-A mapping before using this forecast for the delivery.' : 'Not available as current evidence. The source may be excluded, missing, not yet recorded or future-effective.',
      'preserve-date-meaning', id === 'proposal' ? [...evidence, ...claims.filter(c => c.predicate === 'approval_evidence' && c.subject === data.delivery.id)] : evidence, id === 'proposal' ? 'Who can confirm whether the proposed date has been approved? A meeting note does not amend the schedule.' : 'Is this source applicable to the delivery at the scenario date? Inspect identity, effective date and source status.');
  }
  const commitment = pick('customer_commitment_date', data.delivery.id), forecast = pick('forecast_date', data.delivery.id);
  let comparisonDays: number | null = null;
  if (commitment.claim && forecast.claim && commitment.claim.scope === forecast.claim.scope && commitment.claim.period === forecast.claim.period) comparisonDays = calendarDay(String(forecast.claim.value)) - calendarDay(String(commitment.claim.value));
  add('date-comparison', 'Forecast against stated commitment', comparisonDays === null ? 'unavailable' : 'derived', comparisonDays === null ? 'Date comparison unavailable: resolve identity, missing evidence, scope or conflicting claims.' : comparisonDays === 0 ? 'Matches the stated commitment date; this does not establish completion.' : `${Math.abs(comparisonDays)} calendar day${Math.abs(comparisonDays) === 1 ? '' : 's'} ${comparisonDays > 0 ? 'after' : 'before'} the stated commitment. This compares future dates, not actual delivery.`, 'calendar-days-v1: forecast − commitment in UTC calendar days', [...commitment.all, ...forecast.all], 'What should the planning and commercial owners check before communicating a changed date?');
  function compare(a: string, b: string, subject: string) {
    const left = pick(a, subject), right = pick(b, subject);
    const l = left.claim, r = right.claim;
    const compatible = l && r && l.unit === r.unit && l.scope === r.scope && l.period === r.period && l.scope !== '' && l.period !== '' && typeof l.value === 'number' && typeof r.value === 'number';
    return { left: l, right: r, inputs: [...left.all, ...right.all], compatible, conflict: left.conflict || right.conflict };
  }
  const capacity = compare('required_hours', 'available_hours', data.delivery.id);
  const capacityGap = capacity.compatible ? Number(capacity.left!.value) - Number(capacity.right!.value) : null;
  add('capacity', 'Resource comparison', capacity.conflict ? 'conflicting' : capacityGap === null ? 'unavailable' : 'derived', capacityGap === null ? 'Capacity comparison unavailable: matching subject, period and hours are required.' : capacityGap > 0 ? `${capacityGap} hours less available than required for ${capacity.left!.period}.` : `${Math.abs(capacityGap)} hours available above requirements for ${capacity.left!.period}.`, 'capacity-v1: required hours − available hours; same subject/period/unit', capacity.inputs, 'Can the resource owner resolve the capacity gap? This does not calculate a new date.');
  const budget = compare('baseline_minor', 'forecast_minor', data.project.id);
  budget.compatible = budget.compatible && /^minor:[A-Z]{3}:[1-9]\d*$/.test(budget.left!.unit);
  const budgetVariance = budget.compatible ? Number(budget.right!.value) - Number(budget.left!.value) : null;
  const unit = budget.left?.unit.split(':') ?? [];
  const scale = Number(unit[2]);
  if (budget.compatible && (!Number.isSafeInteger(scale) || scale <= 0 || !Number.isSafeInteger(budgetVariance))) throw new Error('Invalid money scale or unsafe minor-unit calculation.');
  const percent = budget.compatible && Number(budget.left!.value) !== 0 ? `${(Number(budgetVariance) / Number(budget.left!.value) * 100).toFixed(1)}%` : 'not defined';
  add('budget', 'Project cost comparison', budget.conflict ? 'conflicting' : budgetVariance === null ? 'unavailable' : 'derived', budgetVariance === null ? 'Project cost comparison unavailable: matching project, currency and reporting scope are required.' : `${unit[1]} ${new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(Math.abs(budgetVariance) / scale)} ${budgetVariance < 0 ? 'below' : 'above'} baseline (${percent}). These sources do not establish that the delivery change caused the variance.`, 'budget-v1: forecast − baseline in integer minor units; percentage = difference / baseline × 100 (undefined at zero)', budget.inputs, 'What explains the project variance? Do not attribute it to the delivery change without evidence.');
  return { findings, practice: structuredClone(practice), asOf: data.scenario.as_of, ruleVersion: data.scenario.rule_version, comparisonDays, capacityGap, budgetVariance };
}
