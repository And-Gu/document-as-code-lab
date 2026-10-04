import { execFileSync } from 'node:child_process';
import { repositoryRoot } from './repository';

export function chapterHistory(source: string) {
  const git = (...args: string[]) => execFileSync('git', args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  try {
    const revision = git('rev-parse', 'HEAD');
    const changedLocally = Boolean(git('status', '--porcelain', '--', source));
    const log = git('log', '--follow', '-3', '--format=%H%x00%s%x00%an%x00%cI', '--', source);
    const commits = log ? log.split('\n').map((line) => {
      const [sha, message, author, date] = line.split('\0');
      return { sha, message, author, date };
    }) : [];
    return { revision, changedLocally, commits };
  } catch {
    console.warn(`Chapter history unavailable for ${source}`);
    return { revision: undefined, changedLocally: false, commits: [] };
  }
}
