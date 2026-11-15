import data from '../../../data/course-concepts.json';

export interface Concept {
  id: string;
  label: string;
  group: number;
  description: string;
  reading: { chapter: string; anchor: string; title?: string; href?: string }[];
}
export interface Connection { source: string; target: string; label: string; }
export const concepts: Concept[] = data.nodes;
export const connections: Connection[] = data.links;

// Fail the site build if the maintained map has broken identities or connections.
const ids = new Set(concepts.map(node => node.id));
if (ids.size !== concepts.length) throw new Error('Concept IDs must be unique');
for (const node of concepts) {
  if (!node.label || !node.description || !node.reading.length || node.group < 1 || node.group > 4) {
    throw new Error(`Incomplete concept: ${node.id}`);
  }
  if (!connections.some(link => link.source === node.id || link.target === node.id)) {
    throw new Error(`Unconnected concept: ${node.id}`);
  }
}
for (const link of connections) {
  if (!ids.has(link.source) || !ids.has(link.target) || !link.label || link.source === link.target) {
    throw new Error(`Invalid concept connection: ${link.source} → ${link.target}`);
  }
}
