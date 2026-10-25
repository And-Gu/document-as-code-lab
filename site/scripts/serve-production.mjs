import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = await realpath(fileURLToPath(new URL('../dist/', import.meta.url)));
const base = '/document-as-code-lab/';
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff':'font/woff', '.woff2':'font/woff2', '.pdf':'application/pdf', '.md':'text/plain; charset=utf-8' };
const server = createServer(async (req, res) => {
  const fail = (code, message) => { res.writeHead(code, { 'Content-Type':'text/plain' }); res.end(message); };
  if (!['GET','HEAD'].includes(req.method)) return fail(405, 'Read-only static server');
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === base.slice(0,-1)) { res.writeHead(301, { Location:base }); return res.end(); }
    if (!pathname.startsWith(base)) return fail(404, 'Not found');
    let candidate = path.resolve(root, pathname.slice(base.length));
    if (candidate !== root && !candidate.startsWith(root + path.sep)) return fail(404, 'Not found');
    if ((await stat(candidate)).isDirectory()) candidate = path.join(candidate, 'index.html');
    const actual = await realpath(candidate);
    if (!actual.startsWith(root + path.sep)) return fail(404, 'Not found');
    const body = await readFile(actual);
    res.writeHead(200, { 'Content-Type':types[path.extname(actual)] ?? 'application/octet-stream', 'Cache-Control':'no-store', 'Content-Length':body.length });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { fail(404, 'Not found'); }
});
server.listen(Number(process.env.E2E_PORT || 4340), '127.0.0.1');
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
