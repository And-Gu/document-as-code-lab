import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const base = '/document-as-code-lab/';
// Fault controls are injected only by this local test server, never into build output.
const harness = `<script>
const originalFetch = window.fetch.bind(window);
let fault = new URL(location.href).searchParams.get('fault') || 'live', requests = 0;
const actualHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden').get;
let testHidden = false;
Object.defineProperty(document, 'hidden', { configurable: true, get: () => testHidden || actualHidden.call(document) });
window.fetch = (url, options) => {
  const endpoint = String(url), api = endpoint.startsWith('https://api.github.com/'), metrics = endpoint.includes('/data/project-metrics.json'), snapshot = endpoint.includes('/data/project-operations.json');
  if (api || metrics || snapshot) { requests++; document.querySelector('#test-requests').textContent = String(requests); const li = document.createElement('li'); li.textContent = endpoint; document.querySelector('#test-network').append(li); }
  if (fault === 'offline' && (api || metrics || snapshot)) return Promise.reject(new TypeError('Offline test'));
  if (fault === 'snapshot-error' && snapshot) return Promise.resolve(new Response('{}', { status: 503 }));
  if (snapshot && new URL(location.href).searchParams.has('fixture')) {
    const item = { id: '1', title: 'Test fixture', url: 'https://github.com/And-Gu/document-as-code-lab/issues/1', date: '2026-10-11T10:00:00Z', author: 'test', labels: [] };
    return Promise.resolve(new Response(JSON.stringify({ schema_version: 1, generated_at: '2026-10-11T11:00:00Z', source_commit: 'a'.repeat(40), repository: { owner: 'And-Gu', name: 'document-as-code-lab', branch: 'main' }, results: Object.fromEntries(['issues', 'pulls', 'commits', 'workflows'].map(key => [key, { state: 'Published snapshot', retrievedAt: '2026-10-11T11:00:00Z', data: { items: [key === 'workflows' ? { ...item, state: 'success', branch: 'main' } : item], scope: 'Test fixture', ...(['issues', 'pulls'].includes(key) ? { total: 1 } : {}) } }])) })));
  }
  if (fault === 'rate-limit' && api) return Promise.resolve(new Response('{}', { status: 429, headers: { 'retry-after': '60', 'x-ratelimit-remaining': '0' } }));
  if (fault === 'metrics-error' && metrics) return Promise.resolve(new Response('{}', { status: 503 }));
  return originalFetch(url, options);
};
document.addEventListener('DOMContentLoaded', () => { document.querySelector('#test-fault').value = fault; document.querySelector('#test-fault').addEventListener('change', event => { fault = event.target.value; }); document.querySelector('#test-hidden').addEventListener('change', event => { testHidden = event.target.checked; document.dispatchEvent(new Event('visibilitychange')); }); });
</script>
<aside style="padding:1rem;background:#fff1cb;color:#222"><strong>Local browser test harness</strong> <label>Network fault <select id="test-fault"><option value="live">Live network</option><option value="offline">Offline</option><option value="rate-limit">API rate limit</option><option value="metrics-error">Metrics failure</option><option value="snapshot-error">Snapshot failure</option></select></label> <label><input id="test-hidden" type="checkbox"> Simulate hidden tab</label> Requests: <span id="test-requests">0</span><details><summary>Observed browser fetch requests</summary><ul id="test-network"></ul></details></aside>`;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    const requestedUrl = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(requestedUrl.pathname);
    if (!pathname.startsWith(base)) { response.writeHead(404).end('Use the project base path'); return; }
    let file = path.resolve(root, pathname.slice(base.length));
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    let content = await readFile(file);
    if (pathname === base + 'dashboard/' && !requestedUrl.searchParams.has('plain')) content = Buffer.from(content.toString().replace('<body>', '<body>' + harness));
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' }).end(content);
  } catch { response.writeHead(404).end('Not found'); }
});
server.listen(4327, '127.0.0.1', () => console.log('Built-site test harness: http://127.0.0.1:4327/document-as-code-lab/dashboard/'));
