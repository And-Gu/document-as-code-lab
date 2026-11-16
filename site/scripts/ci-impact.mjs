import { appendFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { repositoryRoot } from './environment.mjs';

const map = JSON.parse(readFileSync(new URL('../ci-impact.json', import.meta.url), 'utf8'));
const full = reason => ({ browser: 'all', browser_args: '', pdf: true, reasons: [reason] });
export function classify(files, configuration = map) {
  if (configuration.version !== 1 || !Array.isArray(configuration.rules) || configuration.rules.some(rule =>
    !['all', 'presentations'].includes(rule.browser) || typeof rule.pdf !== 'boolean' ||
    !Array.isArray(rule.files) || !Array.isArray(rule.prefixes))) throw new Error('Invalid CI impact map; refusing to skip checks');
  if (!files.length) return full('No changed paths established; run the full gate');
  let browser = 'presentations', pdf = false;
  const reasons = new Set();
  for (const file of files) {
    const rule = configuration.rules.find(rule => rule.files.includes(file) || rule.prefixes.some(prefix => file.startsWith(prefix)));
    if (!rule) { browser = 'all'; pdf = true; reasons.add('Unmapped input: full gate'); }
    else { if (rule.browser === 'all') browser = 'all'; pdf ||= rule.pdf; reasons.add(rule.name); }
  }
  // Only maintained constant selectors enter a shell, never changed filenames.
  return { browser, browser_args: browser === 'all' ? '' : 'presentations.spec.ts journeys.spec.ts', pdf, reasons: [...reasons] };
}

export function changedFiles({ root = repositoryRoot, base, head = 'HEAD', workingTree = false }) {
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const resolve = revision => git(['rev-parse', '--verify', '--end-of-options', `${revision}^{commit}`]).trim();
  const baseSHA = resolve(base), headSHA = resolve(head);
  const files = git(['diff', '--name-only', '--no-renames', '-z', `${baseSHA}...${headSHA}`, '--']).split('\0').filter(Boolean);
  if (workingTree) files.push(...git(['diff', '--name-only', '--no-renames', '-z', headSHA, '--']).split('\0').filter(Boolean), ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean));
  return [...new Set(files)].sort();
}

export function impactFromGit(options) {
  try { const files = changedFiles(options); return { ...classify(files), files }; }
  catch { return { ...full('Diff or map unavailable: full gate (check refs and fetch history)'), files: [] }; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const value = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
  let base = value('--base'), head = value('--head') || 'HEAD';
  let forceFull = args.includes('--full');
  if (args.includes('--ci')) {
    const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
    base = event.pull_request?.base?.sha;
    head = event.pull_request?.head?.sha || 'HEAD';
    forceFull ||= process.env.GITHUB_EVENT_NAME !== 'pull_request';
  }
  const result = forceFull ? { ...full('Explicit full run or non-PR event'), files: [] } : impactFromGit({ base, head, workingTree: args.includes('--working-tree') });
  console.log(JSON.stringify(result, null, 2));
  if (args.includes('--ci')) {
    appendFileSync(process.env.GITHUB_OUTPUT, `browser_args=${result.browser_args}\npdf=${result.pdf}\n`);
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Change impact\n\nBrowser: ${result.browser}. PDF: ${result.pdf ? 'render and verify' : 'no mapped PDF input changed'}. Static checks and build remain required.\n\n${result.reasons.map(reason => `- ${reason}`).join('\n')}\n`);
  }
}
