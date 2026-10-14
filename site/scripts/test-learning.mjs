import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/learning.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText.replace("from 'markdown-it'", `from '${import.meta.resolve('markdown-it')}'`);
const { prepareQuestions, answerMatches, renderLearningMarkdown, processProcedures, orientationReadiness } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const question = { id: 'heading', question: 'Heading?', options: [{ value: 'a', label: 'Yes' }, { value: 'b', label: 'No' }], correct: ['a'], explanation: 'A heading.' };
assert.equal(prepareQuestions([question])[0].type, 'single');
assert.equal(prepareQuestions([{ ...question, type: 'true-false', correct: ['false'] }])[0].options[1].value, 'false');
assert.throws(() => prepareQuestions([question, question]), /unique/);
assert.throws(() => prepareQuestions([{ ...question, correct: ['missing'] }]), /Invalid/);
assert.throws(() => prepareQuestions([{ ...question, correct: ['a', 'b'] }]), /Invalid/);
assert.equal(answerMatches(['b', 'a'], ['a', 'b']), true);
assert.equal(answerMatches([], ['a']), false);
assert.equal(answerMatches(['a'], ['a', 'b']), false);
assert.equal(answerMatches(['a', 'b'], ['a']), false);
assert.match(renderLearningMarkdown('## Access'), /<h2>Access<\/h2>/);
assert.match(renderLearningMarkdown('| Item | Status |\n| --- | --- |\n| Access | Pending |'), /<table>/);
assert.match(renderLearningMarkdown('`file.md`\n\n```bash\necho test\n```'), /language-bash/);
const hostile = renderLearningMarkdown('<script>alert(1)</script>\n\n[run](javascript:alert(1))\n\n![tracking](https://example.com/image.png)');
assert.ok(!hostile.includes('<script>'));
assert.ok(!hostile.includes('href="javascript:'));
assert.ok(!hostile.includes('<img'));
const chapter = await readFile(new URL('../dist/chapters/04-markdown/index.html', import.meta.url), 'utf8');
assert.equal((chapter.match(/data-markdown-playground/g) ?? []).length, 1);
assert.equal((chapter.match(/data-learning-quiz/g) ?? []).length, 1);
assert.ok(chapter.includes('name="chapter-04-question-1"'));
assert.ok(chapter.includes('Which Markdown line creates a top-level heading?'));
assert.ok(chapter.includes('# Requesting System Access'));
assert.doesNotMatch(renderLearningMarkdown('| Item | Status |\n| Access | Pending |'), /<table>/);
const slugs = ["01-introduction","02-github-workspace","03-project-growth","04-markdown","05-structured-content","06-information-architecture","07-processing","08-ai-native","09-images","10-git-review","11-quality-checks","12-publishing","13-beyond-github","14-automation"];
for (const slug of slugs) {
  const html = await readFile(new URL(`../dist/chapters/${slug}/index.html`, import.meta.url), 'utf8');
  assert.equal((html.match(/data-learning-quiz/g) ?? []).length, 1, slug);
  assert.ok(html.includes('id="chapter-quiz-widget"'), slug);
  assert.ok(!html.includes('[AGENT'), slug);
  assert.ok(!html.includes('VISUAL:'), slug);
  assert.equal((html.match(/data-markdown-playground/g) ?? []).length, slug === '04-markdown' ? 1 : 0);
}
const candidates = JSON.parse(await readFile(new URL('../../examples/learning/questions.json', import.meta.url), 'utf8'));
for (const items of Object.values(candidates)) {
  assert.ok(items.every(q => ['single_select', 'true_false'].includes(q.type)));
  const prepared = prepareQuestions(items.map((q, i) => ({ id: String(i), question: q.question, type: q.type === 'true_false' ? 'true-false' : 'single', options: q.options.map((label, i) => ({ value: String(i), label })), correct: [q.type === 'true_false' ? q.options[q.correctIndex].toLowerCase() : String(q.correctIndex)], explanation: q.feedback })));
  assert.equal(prepared.length, 2);
}
const procedures = [{ id: 'PROC-001', owner: 'team', status: 'approved', body: '# Access' }, { id: 'PROC-003', owner: 'people', status: 'draft', body: '# Contacts' }];
assert.deepEqual(processProcedures(procedures).queue, ['PROC-003 · people']);
const approved = procedures.map(p => ({ ...p, status: 'approved' }));
assert.deepEqual(processProcedures(approved).queue, []);
assert.throws(() => processProcedures([{ ...procedures[0], owner: '' }]), /owner is required/);
assert.throws(() => processProcedures([{ ...procedures[0], status: 'invalid' }]), /status must/);
assert.equal(orientationReadiness('delayed', 'complete'), 'Blocked');
assert.equal(orientationReadiness('complete', 'complete'), 'Ready to start');
assert.equal(orientationReadiness('complete', 'planned'), 'Blocked');
console.log('Fourteen lesson mounts, quiz mapping, Markdown safety, procedure processing, validation failures, and readiness rules passed.');
