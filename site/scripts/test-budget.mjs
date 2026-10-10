import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@rhpaiva/cssv';
import widget from '../plugins/growth-widget.mjs';

const source = readFileSync(new URL('../../examples/dashboards/department-budget.cssv', import.meta.url), 'utf8');
const chapter = readFileSync(new URL('../../docs/10-dashboards.md', import.meta.url), 'utf8');
const model = parse(source);
assert.deepEqual(model.columns, ['Category', 'Planned SEK', 'Actual SEK', 'Variance SEK']);
assert.equal(model.rows.length, 5);
for (const { fields } of model.rows) {
  assert.equal(Number(fields[3]), Number(fields[2]) - Number(fields[1]));
  const formatted = [fields[0], ...fields.slice(1).map(value => Number(value).toLocaleString('en-GB'))];
  assert.ok(chapter.includes(`| ${formatted.join(' | ')} |`), `Markdown snapshot differs for ${fields[0]}`);
}
assert.equal(model.rows.reduce((sum, row) => sum + Number(row.fields[3]), 0), 11000);
const over = model.rows.filter(row => Number(row.fields[3]) > 0);
assert.equal(over.length, 2);
assert.equal(over.reduce((sum, row) => sum + Number(row.fields[3]), 0), 21000);
for (const name of ['project-growth', 'budget-table']) {
  const tree = { type: 'root', children: [{ type: 'comment', value: ` interactive: ${name} ` }] };
  widget()(tree);
  assert.equal(tree.children[0].properties.id, `${name}-widget`);
}
console.log('Budget values, Markdown snapshot, totals, and widget markers passed.');
