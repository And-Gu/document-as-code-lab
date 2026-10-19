import Ajv from 'ajv';
import schema from '../../../examples/learning/scenario-checks.schema.json';
import { prepareQuestions } from './learning';

export interface ScenarioCheck {
  id: string;
  chapter: number;
  marker: string;
  heading: string;
  context: string;
  question: string;
  choices: { id: string; label: string }[];
  correctChoice: string;
  hint?: string;
  feedback: string;
  takeaway: string;
}

const validate = new Ajv({ allErrors: true }).compile<ScenarioCheck[]>(schema);
export function prepareScenarioChecks(input: unknown): ScenarioCheck[] {
  if (!validate(input)) throw new Error('Invalid scenario configuration: ' + JSON.stringify(validate.errors));
  const markers = new Set<string>();
  for (const scenario of input) {
    if (markers.has(scenario.marker)) throw new Error('Scenario markers must be unique.');
    markers.add(scenario.marker);
  }
  prepareQuestions(input.map(scenario => ({
    id: scenario.id,
    question: scenario.question,
    options: scenario.choices.map(choice => ({ value: choice.id, label: choice.label })),
    correct: [scenario.correctChoice],
    explanation: scenario.feedback,
  })));
  return input;
}
