import { useState } from 'react';
import { useReveal } from '@revealjs/react';
import type { DemoRecord } from '../../lib/presentations';

export default function SourceSelection({ records }: { records: DemoRecord[] }) {
  const deck = useReveal();
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const included = records.filter((record) => includeDrafts || record.status === 'approved');
  const hasDrafts = included.some((record) => record.status === 'draft');
  return <div className="source-selection">
    <p className="demo-instruction">Change the inclusion rule to see which procedures reach the output.</p>
    <div className="demo-controls" role="group" aria-label="Inclusion rule">
      <button type="button" disabled={!deck} aria-pressed={!includeDrafts} onClick={() => setIncludeDrafts(false)}>Approved only</button>
      <button type="button" disabled={!deck} aria-pressed={includeDrafts} onClick={() => setIncludeDrafts(true)}>Include drafts</button>
    </div>
    <table>
      <caption>Fictional onboarding sources</caption>
      <thead><tr><th scope="col">Maintained procedure</th><th scope="col">Source status</th><th scope="col">In output</th></tr></thead>
      <tbody>{records.map((record) => <tr key={record.id}>
        <th scope="row"><a href={record.url}>{record.title}</a><small>{record.id} / {record.owner}</small></th>
        <td>{record.status}</td><td>{included.includes(record) ? 'Included' : 'Excluded'}</td>
      </tr>)}</tbody>
    </table>
    <p className="demo-result" role="status">{included.length} of {records.length} procedures included. {hasDrafts
      ? 'Review copy: draft content needs review.'
      : included.length < records.length ? 'Draft content excluded: the output is incomplete.' : 'All selected sources have approved status.'}</p>
    <p className="demo-scope">The rule selects content. It does not approve the assembled publication.</p>
  </div>;
}
