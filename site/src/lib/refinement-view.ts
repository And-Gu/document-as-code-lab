import type { RefinementData, Result } from './refinement-model';
export const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export function renderRefinement(data: RefinementData, result: Result, base: string, prefix = 'result') {
  const e = escapeHtml;
  const url = (source: string) => `${base}materials/${source.replace(/\.md$/, '')}/`;
  const evidence = (sourceId: string) => sourceId === data.delivery.id ? data.delivery : data.sources.find(s => s.id === sourceId)!;
  return `<p class="ref-disclosure">Draft for review · Scenario date ${e(result.asOf)} · ${e(result.ruleVersion)}. Nothing is approved, sent or published.</p>
    <h3>Situation overview</h3><div class="ref-results">${result.findings.map(f => `<section id="${prefix}-${f.id}"><h4>${e(f.title)}</h4><p class="ref-state">${e(f.state)}</p><p>${e(f.text)}</p><details><summary>Why this appears</summary><p>Rule: <code>${e(f.rule)}</code> (${e(result.ruleVersion)})</p>
    ${f.inputs.length ? `<ul>${f.inputs.map(c => { const s = evidence(c.sourceId); return `<li><a data-ref-source href="${url(s.source)}">${e(c.sourceId)} · ${e(c.field)}</a>: ${e(c.value ?? 'not available')} ${e(c.unit)}. Subject: ${e(c.subject)}; scope: ${e(c.scope || 'not specified')}; period: ${e(c.period || 'date claim')}${c.validFrom ? `; effective from ${e(c.validFrom)}` : ''}.<br/>Revision: <code>${e(s.revision)}</code><br/>SHA-256: <code>${e(s.digest)}</code></li>`; }).join('')}</ul>` : '<p>No usable selected source claim. Inspect excluded sources and missing fields.</p>'}
    <p>Mapping: ${result.practice.mapping ? 'teaching mapping used in this exercise' : 'unresolved'}. ${e(data.mappings.map(m => `${m.external_ref} → ${m.canonical_id}: ${m.basis}`).join(' '))}</p>
    <p>Local overrides: forecast ${e(result.practice.forecast || 'unchanged')}; excluded sources ${e(result.practice.excluded.join(', ') || 'none')}. Maintained files are unchanged.</p></details><p><strong>What still needs a person?</strong> ${e(f.question)}</p></section>`).join('')}</div>
    <h3>Review questions</h3><ul>${result.findings.map(f => `<li><a href="#${prefix}-${f.id}">${e(f.title)}</a>: ${e(f.question)}</li>`).join('')}</ul>
    <h3>Draft briefing</h3><div data-ref-briefing>${result.findings.map(f => `<p>${e(f.title)}: ${e(f.text)} <a href="#${prefix}-${f.id}">Evidence and rule</a></p>`).join('')}</div>
    <details><summary>Build provenance</summary><p>Scenario date: ${e(result.asOf)}. Rule version: ${e(result.ruleVersion)}. Inputs and identity mapping are identified below; local choices are shown with each finding.</p><ul>${data.manifests.map(m => `<li><a href="${base}files/${m.source}">${e(m.source)}</a><br/>Revision: <code>${e(m.revision)}</code><br/>SHA-256: <code>${e(m.digest)}</code></li>`).join('')}</ul></details>`;
}
