import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import approval from '../../../data/editorial-approval.json';
import { repositoryRoot } from './repository';

export async function editorialApprovalFor(source: string) {
  const record = approval.files.find(file => file.path === source);
  if (!record) return;
  const bytes = await readFile(path.join(repositoryRoot, source));
  if (createHash('sha256').update(bytes).digest('hex') !== record.sha256) return;
  return { status: approval.status, date: approval.date, reviewer: approval.reviewer };
}
