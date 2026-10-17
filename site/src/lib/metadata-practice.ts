import Ajv from 'ajv';
import { parseDocument } from 'yaml';

export function readPracticeFrontmatter(source: string) {
  const normalized = source.replace(/\r\n?/g, '\n');
  const block = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(normalized);
  if (!block) return { body: normalized, metadata: undefined, errors: ['Frontmatter: put YAML fields between opening and closing --- lines at the start of the file.'] };
  const body = normalized.slice(block[0].length).trimStart();
  try {
    const document = parseDocument(block[1], { uniqueKeys: true });
    if (document.errors.length) return { body, metadata: undefined, errors: document.errors.map((error) => `YAML: ${error.message}`) };
    if (document.warnings.length) return { body, metadata: undefined, errors: document.warnings.map((warning) => `YAML: ${warning.message}`) };
    return { body, metadata: document.toJS({ maxAliasCount: 20 }) as unknown, errors: [] as string[] };
  } catch (error) {
    return { body, metadata: undefined, errors: [`YAML: ${error instanceof Error ? error.message : 'Unable to read metadata.'}`] };
  }
}

const ajv = new Ajv({ allErrors: true });
export function validatePracticeMetadata(source: string, schema: object) {
  const parsed = readPracticeFrontmatter(source);
  if (parsed.errors.length) return { valid: false, errors: parsed.errors };
  const validate = ajv.compile(schema);
  const valid = validate(parsed.metadata);
  const errors = (validate.errors ?? []).map((error) => {
    const field = error.keyword === 'required' ? error.params.missingProperty
      : error.keyword === 'additionalProperties' ? error.params.additionalProperty
      : error.instancePath.slice(1) || 'metadata';
    const allowed = error.keyword === 'enum' ? ` (${error.params.allowedValues.join(', ')})` : '';
    return `${field}: ${error.message}${allowed}.`;
  });
  return { valid, errors };
}
