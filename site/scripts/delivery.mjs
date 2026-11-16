import { parseArgs } from 'node:util';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { repositoryRoot, siteRoot } from './environment.mjs';
import { readDelivery, recordPath, updateDelivery, requireOwner, startDelivery, assignTask, beginPhase, endPhase, formatDelivery, timestamp } from './delivery-record.mjs';

const { values: options, positionals } = parseArgs({ allowPositionals: true, options: {
  owner: { type: 'string' }, actor: { type: 'string' }, task: { type: 'string' }, worker: { type: 'string' },
  mode: { type: 'string' }, file: { type: 'string', multiple: true }, project: { type: 'string', multiple: true },
  grep: { type: 'string' }, preview: { type: 'boolean' }, phase: { type: 'string' }, at: { type: 'string' },
  status: { type: 'string' }, evidence: { type: 'string' }, reason: { type: 'string' }, json: { type: 'boolean' },
  target: { type: 'string' },
} });
const [command, ...childArgs] = positionals;
const file = recordPath(), actor = options.actor || process.env.DELIVERY_ACTOR;
const execute = (executable, args, env) => new Promise((resolve, reject) => {
  const child = spawn(executable, args, { cwd: siteRoot, env: { ...process.env, ...env }, stdio: 'inherit' });
  const forward = signal => child.kill(signal);
  const interrupt = () => forward('SIGINT'), terminate = () => forward('SIGTERM');
  process.once('SIGINT', interrupt); process.once('SIGTERM', terminate);
  child.once('error', reject);
  child.once('exit', (code, signal) => {
    process.removeListener('SIGINT', interrupt); process.removeListener('SIGTERM', terminate);
    resolve(signal ? 1 : code ?? 1);
  });
});

try {
  if (command === 'start') startDelivery(file, options.owner, repositoryRoot);
  else if (command === 'assign') assignTask(file, actor, { name: options.task, worker: options.worker, mode: options.mode, files: options.file, projects: options.project, grep: options.grep, preview: options.preview, target: options.target });
  else if (command === 'test') {
    const record = readDelivery(file), task = record?.tasks[options.task];
    if (!task || task.worker !== actor) throw new Error('Choose a task assigned to this actor.');
    process.exitCode = await execute(process.execPath, [path.join(siteRoot, 'scripts/run-browser-tests.mjs'), ...(task.mode !== 'local' ? ['--hosted'] : []), ...(task.mode === 'hosted' ? ['--scenarios'] : []), ...(task.preview ? ['--preview'] : []), ...task.args], { DELIVERY_ACTOR: actor, DELIVERY_TASK: task.name, EXPECTED_REVISION: task.revision, ...(task.target ? { HOSTED_URL: task.target } : {}) });
  } else if (command === 'run') {
    if (!childArgs.length) throw new Error('Use delivery run --phase <name> -- <command> [arguments]. Commands run from site/.');
    beginPhase(file, actor, options.phase, undefined, options.evidence);
    let status = 'failed';
    try { process.exitCode = await execute(childArgs[0], childArgs.slice(1), { DELIVERY_ACTOR: actor }); status = process.exitCode === 0 ? 'passed' : 'failed'; }
    finally { endPhase(file, actor, options.phase, status); }
  } else if (command === 'begin') beginPhase(file, actor, options.phase, options.at, options.evidence);
  else if (command === 'end') endPhase(file, actor, options.phase, options.status, options.at);
  else if (['mark', 'retry', 'handoff', 'finish'].includes(command)) updateDelivery(file, record => {
    requireOwner(record, actor);
    const at = new Date().toISOString();
    if (command === 'mark') {
      if (!Object.hasOwn(record.milestones, options.phase)) throw new Error('Milestone must be requested, ready, authorized, committed, merged or published.');
      record.milestones[options.phase] = options.at === 'unknown' ? null : timestamp(options.at || at);
    } else if (command === 'retry') {
      const task = record.tasks[options.task];
      if (!task || !['passed', 'failed'].includes(task.status) || !options.reason?.trim()) throw new Error('Retry a finished task with an explicit reason. Running tasks must finish first.');
      task.status = 'pending';
    } else {
      if (record.phases.some(p => !p.finished_at) || Object.values(record.tasks).some(t => t.status === 'running')) throw new Error('Finish active commands/tests before handoff or closing.');
      if (command === 'handoff') {
        if (!/^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,99}$/.test(options.owner || '') || !options.reason?.trim()) throw new Error('Handoff requires a valid next-owner label and a reason.');
        record.owner = options.owner;
      } else record.closed_at = at;
    }
    record.events.push({ at, actor, type: command, task: options.task, phase: options.phase, value: command === 'mark' ? record.milestones[options.phase] : undefined, next_owner: options.owner, reason: options.reason, evidence: options.evidence });
    return record;
  });
  else if (command !== 'report') throw new Error('Commands: start, assign, test, run, begin, end, mark, retry, handoff, finish, report. See site/README.md.');
  if (command === 'report') console.log(options.json ? JSON.stringify(readDelivery(file), null, 2) : formatDelivery(readDelivery(file)));
  else console.log(`Delivery record: ${file}`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
