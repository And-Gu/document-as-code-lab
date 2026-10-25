import path from 'node:path';
import { visit } from 'unist-util-visit';

// Bounded adapter for the maintained simple process diagrams in chapters 6 and 7.
// Fail closed on an unfamiliar edge syntax rather than silently omit a relationship.
export function diagramRelationships(source) {
  const labels = new Map([...source.matchAll(/([\w-]+)\[([^\]]+)\]/g)].map(match => [match[1], match[2]]));
  const relationships = [];
  for (const line of source.trim().split('\n').slice(1)) {
    const clean = line.trim();
    if (!clean) continue;
    const tokens = clean.split(/\s*(-->|-\.->)(?:\|([^|]+)\|)?\s*/);
    if (tokens.length < 4) throw new Error(`Unsupported diagram line: ${clean}`);
    for (let i = 1; i < tokens.length; i += 3) {
      const from = tokens[i - 1].match(/^([\w-]+)(?:\[[^\]]+\])?$/)?.[1];
      const to = tokens[i + 2]?.match(/^([\w-]+)(?:\[[^\]]+\])?$/)?.[1];
      if (!from || !to || !labels.has(from) || !labels.has(to)) throw new Error(`Unresolved diagram edge: ${clean}`);
      relationships.push({ from: labels.get(from), relation: tokens[i + 1] || (tokens[i] === '-.->' ? 'reviews' : 'leads to'), to: labels.get(to) });
    }
  }
  return relationships;
}
const text = value => ({ type: 'text', value });
const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
export default function readableDiagrams() {
  return (tree, file) => {
    if (!['06-information-architecture.md', '07-processing.md'].includes(path.basename(file.path ?? ''))) return;
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || node.properties.dataReadable || index === undefined) return;
      const code = node.children.find(child => child.tagName === 'code');
      if (!code || !(node.properties.dataLanguage === 'mermaid' || code.properties.className?.includes('language-mermaid'))) return;
      const plainText = node => node.value ?? (node.children ?? []).map(plainText).join('');
      const source = plainText(code);
      const rows = diagramRelationships(source);
      node.properties.dataReadable = true;
      parent.children[index] = el('figure', { className: ['readable-diagram'] }, [
        el('figcaption', {}, [text('Follow the relationships')]),
        el('ul', { className: ['diagram-relationships'] }, rows.map(row => el('li', {}, [text(row.relation === 'leads to' ? `From ${row.from.toLowerCase()} to ${row.to.toLowerCase()}.` : row.relation === 'reviews' ? `${row.from} assesses ${row.to.toLowerCase()}.` : `${row.from} ${row.relation} ${row.to}.`)]))),
        el('details', { className: ['diagram-graphic'] }, [el('summary', {}, [text('Show the complete diagram')]), node]),
      ]);
    });
  };
}
