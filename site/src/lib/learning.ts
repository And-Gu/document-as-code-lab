import MarkdownIt from 'markdown-it';

export interface QuizQuestion {
  id: string;
  question: string;
  type?: 'single' | 'multiple' | 'true-false';
  options?: { value: string; label: string }[];
  correct: string[];
  explanation: string;
  hint?: string;
}

export function prepareQuestions(questions: QuizQuestion[]) {
  const ids = new Set<string>();
  return questions.map((question) => {
    if (!question.id || ids.has(question.id)) throw new Error('Quiz IDs must be unique and nonempty.');
    ids.add(question.id);
    const type = question.type ?? 'single';
    const options = type === 'true-false'
      ? [{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }]
      : question.options ?? [];
    const values = new Set(options.map((option) => option.value));
    if (!['single', 'multiple', 'true-false'].includes(type) || !question.question || !question.explanation
      || options.length < 2 || values.size !== options.length || options.some((option) => !option.value || !option.label)
      || !question.correct.length || new Set(question.correct).size !== question.correct.length
      || question.correct.some((value) => !values.has(value))
      || (type !== 'multiple' && question.correct.length !== 1)) {
      throw new Error(`Invalid quiz question: ${question.id}`);
    }
    return { ...question, type, options };
  });
}

export function answerMatches(selected: string[], correct: string[]) {
  const answers = new Set(selected);
  return answers.size === correct.length && correct.every((value) => answers.has(value));
}

const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false });
// Learner content stays local, including images that would otherwise contact a remote host.
markdown.disable('image');
export function renderLearningMarkdown(source: string) {
  return markdown.render(source);
}

export interface ProcedureSource { id: string; owner: string; status: string; body: string; }
export function processProcedures(records: ProcedureSource[]) {
  const ids = new Set<string>();
  for (const record of records) {
    if (!record.id || ids.has(record.id)) throw new Error('Each procedure needs a unique ID.');
    ids.add(record.id);
    if (!record.owner.trim()) throw new Error(`${record.id}: owner is required.`);
    if (!['draft', 'approved'].includes(record.status)) throw new Error(`${record.id}: status must be draft or approved.`);
    if (!record.body.trim()) throw new Error(`${record.id}: procedure text is required.`);
  }
  return {
    handbook: records.map((record) => record.body).join('\n\n'),
    queue: records.filter((record) => record.status === 'draft').map((record) => `${record.id} · ${record.owner}`),
  };
}

export function orientationReadiness(access: string, securityTraining: string) {
  return access === 'complete' && securityTraining === 'complete' ? 'Ready to start' : 'Blocked';
}
