import { useId, useState } from 'react';
import illustration from '../../../../assets/diagrams/information-relationships.svg?raw';

const explanations = {
  handbook: 'The handbook includes Access (PROC-001) and Equipment (PROC-002).',
  access: 'Access (PROC-001) is included in the handbook and refers to the security policy (POL-001).',
  equipment: 'Equipment (PROC-002) is included in the handbook and refers to the security policy (POL-001).',
  policy: 'Both procedures refer to the security policy (POL-001). A policy change identifies both for review.',
};
type NodeId = keyof typeof explanations;
function nodeId(target: EventTarget | null): NodeId | null {
  if (!(target instanceof Element)) return null;
  const value = target.closest('[data-node]')?.getAttribute('data-node');
  return value && Object.hasOwn(explanations, value) ? value as NodeId : null;
}

export default function RelationshipDiagram() {
  const hintId = useId();
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [focused, setFocused] = useState<NodeId | null>(null);
  const [selected, setSelected] = useState<NodeId | null>(null);
  const active = hovered ?? focused ?? selected;
  return <div className="relationship-diagram">
    <div className="relationship-graphic" data-active={active ?? ''} aria-describedby={hintId}
      onPointerOver={(event) => setHovered(nodeId(event.target))}
      onPointerLeave={() => setHovered(null)}
      onFocus={(event) => setFocused(nodeId(event.target))}
      onBlur={(event) => setFocused(nodeId(event.relatedTarget))}
      onClick={(event) => { const id = nodeId(event.target); if (id) setSelected(id); }}
      onKeyDown={(event) => {
        const id = nodeId(event.target);
        if (id && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault(); event.stopPropagation(); setSelected(id);
        }
      }}
      // Only this maintained, bundled SVG is inserted. No user content or
      // fetched markup is accepted; the same file remains the static source.
      dangerouslySetInnerHTML={{ __html: illustration }} />
    <p className="relationship-explanation" id={hintId} role="status">
      {active ? explanations[active] : 'Hover over a box to see its direct connections. You can also use Tab or tap a box.'}
    </p>
  </div>;
}
