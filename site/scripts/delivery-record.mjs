import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, openSync, closeSync, unlinkSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { repositoryRoot } from './environment.mjs';
import { checkoutState } from './release-identity.mjs';
import { validateHostedTarget } from './hosted-target.mjs';

export function recordPath(root = repositoryRoot, env = process.env) {
  if (env.DELIVERY_RECORD && !path.isAbsolute(env.DELIVERY_RECORD)) throw new Error('DELIVERY_RECORD must be an absolute path shared by the participating checkouts.');
  return env.DELIVERY_RECORD || path.join(root, 'build/verification/delivery.json');
}
const now = () => new Date().toISOString();
export function timestamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) throw new Error('Use an ISO timestamp with an explicit time zone (Z or UTC offset).');
  return new Date(value).toISOString();
}
const label = value => {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,99}$/.test(value)) throw new Error('Use a nonempty label of at most 100 letters, digits, dots, colons, underscores or hyphens.');
  return value;
};
export function readDelivery(file = recordPath()) {
  if (!existsSync(file)) return null;
  const record = JSON.parse(readFileSync(file, 'utf8'));
  if (record.version !== 1) throw new Error('Unsupported delivery record version.');
  return record;
}

// Short exclusive writes; never hold this lock while a command or test runs.
export function updateDelivery(file, change) {
  mkdirSync(path.dirname(file), { recursive: true });
  const lock = `${file}.lock`, temporary = `${file}.${randomUUID()}.tmp`;
  let fd;
  const deadline = performance.now() + 500, pause = new Int32Array(new SharedArrayBuffer(4));
  while (fd === undefined) {
    try { fd = openSync(lock, 'wx'); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (performance.now() >= deadline) throw new Error(`Delivery record busy: ${lock}. Retry after the writer finishes; inspect an abandoned lock before removing it.`);
      Atomics.wait(pause, 0, 0, 10); // Bound brief cross-process write contention; never steal a stale lock.
    }
  }
  try {
    writeFileSync(fd, JSON.stringify({ pid: process.pid, at: now() }));
    const result = change(readDelivery(file));
    writeFileSync(temporary, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
    renameSync(temporary, file);
    return result;
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
    closeSync(fd); unlinkSync(lock);
  }
}

export function requireOwner(record, actor) {
  if (!record || record.closed_at) throw new Error('No active delivery. Start one with npm run delivery -- start --owner <chat-or-person>.');
  if (actor !== record.owner) throw new Error(`Delivery owner is ${record.owner}; this action requires that owner or an explicit handoff.`);
}
export function checkBuildOwner(root = repositoryRoot, env = process.env) {
  const record = readDelivery(recordPath(root, env));
  if (record && !record.closed_at) requireOwner(record, env.DELIVERY_ACTOR);
  return record?.closed_at ? 'no active owner' : record?.owner || 'no active owner';
}

export function startDelivery(file, owner, root = repositoryRoot) {
  label(owner);
  return updateDelivery(file, previous => {
    if (previous && !previous.closed_at) throw new Error(`Delivery ${previous.id} is already owned by ${previous.owner}. Read it or hand it off; do not replace it.`);
    if (previous) {
      const archive = path.join(path.dirname(file), 'deliveries');
      mkdirSync(archive, { recursive: true });
      const destination = path.join(archive, `${previous.id}.json`), bytes = JSON.stringify(previous, null, 2) + '\n';
      if (!existsSync(destination)) writeFileSync(destination, bytes, { flag: 'wx' });
      else if (readFileSync(destination, 'utf8') !== bytes) throw new Error('A different archive already exists; preserve and reconcile it before starting another delivery.');
    }
    return { version: 1, id: randomUUID(), owner, checkout: root, started_at: now(), closed_at: null, initial_revision: checkoutState(root).revision,
      milestones: { requested: null, ready: null, authorized: null, committed: null, merged: null, published: null }, tasks: {}, phases: [], events: [] };
  });
}

export function assignTask(file, actor, { name, worker, mode, files, projects = ['chromium'], grep, preview = false, target }, root = repositoryRoot) {
  label(name); label(worker);
  if (!['local', 'hosted', 'smoke'].includes(mode)) throw new Error('Task mode must be local, hosted (scenarios) or smoke.');
  if (!files?.length || new Set(files).size !== files.length) throw new Error('Assign one or more distinct test filenames.');
  const available = readdirSync(path.join(root, mode === 'smoke' ? 'site/tests/hosted' : 'site/tests/e2e'));
  if (files.some(f => !available.includes(f) || !f.endsWith('.spec.ts'))) throw new Error('Assign exact .spec.ts filenames from site/tests/e2e.');
  if (!projects.length || projects.some(p => !['chromium', 'firefox', 'webkit'].includes(p)) || (mode !== 'local' && projects.some(p => p !== 'chromium'))) throw new Error('Choose supported browser projects (hosted: chromium).');
  if (mode !== 'local' && preview) throw new Error('Hosted tasks cannot be previews.');
  const revision = checkoutState(root).revision;
  if (mode !== 'local') target = validateHostedTarget({ HOSTED_URL: target, EXPECTED_REVISION: revision, DEPLOYMENT_RUN_ID: 'assignment' }, revision).url;
  const stage = mode === 'local' ? (preview ? 'preview' : 'release') : `${mode}:${target}`;
  const scopes = files.flatMap(f => projects.map(p => `${revision}:${stage}:${p}:${f}`));
  return updateDelivery(file, record => {
    requireOwner(record, actor);
    if (record.tasks[name]) throw new Error('Task names are exclusive; retry an existing task with a recorded reason.');
    for (const task of Object.values(record.tasks)) if (task.scopes.some(s => scopes.includes(s))) throw new Error(`Overlapping test ownership with ${task.name} (${task.worker}); assign a different file/project/stage or retry that task.`);
    const args = [...projects.map(p => `--project=${p}`), ...files, ...(grep ? ['--grep', grep] : [])];
    record.tasks[name] = { name, worker, mode, preview, revision, target, scopes, args, status: 'pending', attempts: [] };
    record.events.push({ at: now(), actor, type: 'assignment', task: name });
    return record;
  });
}

export function claimTask(file, actor, name, { revision, hosted, scenarios, preview, args, target, runDirectory }) {
  let claimed;
  updateDelivery(file, record => {
    if (!record || record.closed_at) throw new Error('No active delivery for this assigned test.');
    const task = record.tasks[name];
    if (!task || task.worker !== actor) throw new Error('Test task is missing or assigned to another actor. Use delivery assign/test.');
    if (task.status !== 'pending') throw new Error('Task already started or completed; an owner must record a retry reason before rerunning it.');
    if (task.revision !== revision) throw new Error('Assigned revision changed; allocate a task for the new revision.');
    if ((task.mode !== 'local') !== hosted || (task.mode === 'hosted') !== scenarios || task.preview !== preview || task.target !== target || JSON.stringify(task.args) !== JSON.stringify(args)) throw new Error('Run the assigned scope with delivery test; command differs from the assignment.');
    task.status = 'running';
    task.attempts.push({ started_at: now(), finished_at: null, status: 'running', run_directory: runDirectory });
    claimed = { delivery_id: record.id, owner: record.owner, task: name, actor };
    return record;
  });
  return claimed;
}

export function finishTask(file, name, status) {
  return updateDelivery(file, record => {
    const task = record?.tasks[name];
    if (!task || task.status !== 'running') throw new Error('Cannot finish an inactive task.');
    const attempt = task.attempts.at(-1);
    attempt.finished_at = now(); attempt.status = status;
    attempt.duration_ms = Date.parse(attempt.finished_at) - Date.parse(attempt.started_at);
    task.status = status;
    return record;
  });
}

export function beginPhase(file, actor, name, at = now(), evidence = null) {
  label(name);
  at = timestamp(at);
  return updateDelivery(file, record => {
    requireOwner(record, actor);
    if (record.phases.some(p => p.name === name && !p.finished_at)) throw new Error('That phase is already running.');
    record.phases.push({ name, actor, started_at: new Date(at).toISOString(), finished_at: null, duration_ms: null, status: 'running', evidence });
    return record;
  });
}
export function endPhase(file, actor, name, status = 'passed', at = now()) {
  if (!['passed', 'failed', 'interrupted'].includes(status)) throw new Error('Phase status must be passed, failed or interrupted.');
  at = timestamp(at);
  return updateDelivery(file, record => {
    requireOwner(record, actor);
    const phase = record.phases.find(p => p.name === name && !p.finished_at);
    if (!phase || !Number.isFinite(Date.parse(at)) || Date.parse(at) < Date.parse(phase.started_at)) throw new Error('Phase end needs an active phase and a timestamp after its start.');
    phase.finished_at = new Date(at).toISOString(); phase.duration_ms = Date.parse(at) - Date.parse(phase.started_at); phase.status = status;
    return record;
  });
}

export function formatDelivery(record) {
  if (!record) return 'No delivery record.';
  const rows = record.phases.map(p => `| ${p.name} | ${p.status} | ${p.duration_ms === null ? 'unknown / running' : `${(p.duration_ms / 1000).toFixed(3)} s`} | ${p.evidence || 'local record'} |`);
  for (const task of Object.values(record.tasks)) for (const attempt of task.attempts) rows.push(`| test:${task.name} | ${attempt.status} | ${attempt.duration_ms === undefined ? 'unknown / running' : `${(attempt.duration_ms / 1000).toFixed(3)} s`} | ${attempt.run_directory} |`);
  const assignments = Object.values(record.tasks).map(t => `- ${t.name}: ${t.worker}; ${t.mode}${t.preview ? ' preview' : ''}; ${t.status}; revision ${t.revision}; ${t.args.join(' ')}${t.target ? `; target ${t.target}` : ''}`);
  return `Delivery ${record.id}\nOwner: ${record.owner}\nInitial revision: ${record.initial_revision}\n\nAssignments:\n${assignments.join('\n') || '- none'}\n\nMilestones (UTC):\n${Object.entries(record.milestones).map(([k, v]) => `- ${k}: ${v ?? 'unknown'}`).join('\n')}\n\n| Phase | Result | Elapsed | Evidence |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n\nUnrecorded phases are unknown. Overlapping phases are not added together. Milestones record observations, not authorization.\n`;
}
