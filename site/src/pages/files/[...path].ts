import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { repositoryFiles, repositoryRoot } from '../../lib/repository';

export async function getStaticPaths() {
  return (await repositoryFiles()).map((file) => ({
    params: { path: file },
    props: { file },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const file = props.file as string;
  const types: Record<string, string> = {
    '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
    '.json': 'application/json; charset=utf-8',
  };
  const body = await readFile(path.join(repositoryRoot, file));
  return new Response(new Uint8Array(body), {
    headers: { 'Content-Type': types[path.extname(file)] ?? 'text/plain; charset=utf-8' },
  });
};
