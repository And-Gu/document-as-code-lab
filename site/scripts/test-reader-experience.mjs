// Focused package-1 browser regression, separate from package 3's planned cross-engine/hosted harness.
// Set PLAYWRIGHT_MODULE to an installed playwright ESM entry if it is not resolvable here.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.READER_TEST_URL || 'http://127.0.0.1:4321/document-as-code-lab/';
const evidence = process.env.READER_EVIDENCE_DIR || '../build/package-1-browser';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const results = [], errors = [], requests = [];
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
context.on('request', request => { if (request.method() !== 'GET') requests.push(`${request.method()} ${request.url()}`); });
const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
const go = async path => { const response = await page.goto(new URL(path, base).href); assert.equal(response.status(), 200); await page.waitForLoadState('networkidle'); };
const screenshot = async (name, locator) => { if (locator) await locator.screenshot({ path: `${evidence}/${name}.png` }); else await page.screenshot({ path: `${evidence}/${name}.png` }); };
const test = async (name, run) => { if (process.env.READER_TEST_MATCH && !name.includes(process.env.READER_TEST_MATCH)) return; await run(); results.push({ name, result: 'passed' }); console.log(`PASS ${name}`); };
try {
  await test('Homepage → Processing Lab, no account/setup step', async () => {
    await go(''); await page.getByRole('link', { name: 'See one source change several results' }).click();
    await page.waitForURL('**/#processing-lab-widget');
    assert.ok(await page.locator('[data-processing-playground]').isVisible());
  });
  for (const chapter of ['04-markdown', '05-structured-content', '07-processing']) await test(`${chapter}: mobile tabs, keyboard, selection, validation/build and reset`, async () => {
    await go(`chapters/${chapter}/`);
    const source = page.locator('[data-source]'), tabs = page.locator('[data-editor-tabs]');
    const initial = await source.inputValue();
    await source.fill(initial + '\n\nA new practice sentence.');
    await source.evaluate(node => { node.focus(); node.setSelectionRange(9, 15); });
    // Activation need not move DOM focus first (for example Safari pointer activation).
    await tabs.getByRole('tab', { name: 'Preview', exact: true }).evaluate(button => button.click());
    assert.ok(await page.locator('[data-preview]').isVisible());
    await tabs.getByRole('tab', { name: 'Source', exact: true }).click();
    await tabs.getByRole('tab', { name: 'Source', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await tabs.getByRole('tab', { name: 'Preview', exact: true }).getAttribute('aria-selected'), 'true');
    assert.ok(await page.locator('[data-preview]').isVisible()); assert.ok(!await source.isVisible());
    assert.ok((await page.locator('[data-preview]').innerText()).includes('A new practice sentence.'));
    if (chapter !== '04-markdown') assert.ok(await page.locator('[data-validation-result]').isVisible());
    await page.keyboard.press('Home'); await page.keyboard.press('Tab');
    assert.equal(await source.evaluate(node => document.activeElement === node), true);
    assert.deepEqual(await source.evaluate(node => [node.selectionStart, node.selectionEnd]), [9, 15]);
    assert.equal(await source.inputValue(), initial + '\n\nA new practice sentence.');
    if (chapter === '07-processing') {
      const handbook = page.locator('[data-process-handbook]'), build = page.locator('[data-process-build]');
      const previous = await handbook.innerText();
      assert.match(await page.locator('[data-process-status]').innerText(), /last successful/);
      await source.fill(initial.replace('owner: people-team\n', ''));
      await build.click(); assert.equal(await page.locator('[data-process-status]').getAttribute('data-state'), 'invalid');
      assert.equal(await handbook.innerText(), previous);
      await source.fill(initial + '\n\nA new practice sentence.'); await build.click();
      assert.match(await handbook.innerText(), /A new practice sentence/);
      await tabs.getByRole('tab', { name: 'Preview', exact: true }).click();
      assert.match(await handbook.innerText(), /A new practice sentence/);
    }
    if (chapter === '05-structured-content') {
      await source.fill(initial.replace('owner: people-team\n', '')); await page.locator('[data-validate]').click();
      assert.match(await page.locator('[data-validation-result]').innerText(), /owner/);
    }
    await page.locator('[data-reset]').click(); assert.equal(await source.inputValue(), initial);
    assert.ok(await source.isVisible()); assert.equal(await source.evaluate(node => document.activeElement === node), true);
    if (chapter === '07-processing') { await page.locator('[data-process-build]').click(); assert.ok(!(await page.locator('[data-process-handbook]').innerText()).includes('A new practice sentence.')); }
  });
  await test('Blank/partial quiz prompts completion, focuses missing answer, then scores', async () => {
    await go('chapters/04-markdown/');
    const quiz = page.locator('[data-learning-quiz]'); await quiz.getByRole('button', { name: 'Check answers' }).click();
    assert.equal(await quiz.locator('[data-score]').innerText(), 'Answer each question before checking your answers.');
    assert.equal(await quiz.locator('input').first().evaluate(node => document.activeElement === node), true);
    await quiz.locator('fieldset').first().locator('input').first().check(); await quiz.getByRole('button', { name: 'Check answers' }).click();
    assert.ok(!(await quiz.locator('[data-score]').innerText()).includes('correct.'));
    for (const fieldset of await quiz.locator('fieldset').all()) await fieldset.locator('input').first().check();
    await quiz.getByRole('button', { name: 'Check answers' }).click(); assert.match(await quiz.locator('[data-score]').innerText(), /of 2 correct/);
    await quiz.getByRole('button', { name: 'Try again' }).click(); assert.equal(await quiz.locator('input:checked').count(), 0);
  });
  await test('Explorer → DEL-101 readable source → original bytes → deterministic return', async () => {
    await go('chapters/09-images/'); await page.locator('[data-ce-record]').selectOption('DEL-101');
    await page.locator('[data-ce-details]').getByRole('link', { name: 'Read source record', exact: true }).click();
    assert.equal(await page.locator('h1').innerText(), 'DEL-101 — Interface package');
    const content = await page.locator('main').innerText();
    for (const text of ['Delivery', 'Planned', '10 November 2026', 'Belongs to', 'PRJ-101']) assert.ok(content.includes(text));
    const rawUrl = await page.getByRole('link', { name: 'View original source' }).getAttribute('href');
    assert.deepEqual(await (await context.request.get(new URL(rawUrl, base).href)).body(), await readFile('../examples/contract-explorer/records/DEL-101.md'));
    await page.getByRole('link', { name: 'PRJ-101 — Depot rollout' }).click(); assert.match(await page.locator('h1').innerText(), /PRJ-101/);
    await go('materials/examples/contract-explorer/records/DEL-101/'); await page.getByRole('link', { name: 'Return to Contract Explorer' }).click();
    await page.waitForLoadState('networkidle'); assert.equal(await page.locator('[data-ce-record]').inputValue(), 'DEL-101');
    await page.locator('[data-ce-guide]').click(); assert.equal(await page.locator('[data-ce-view="impact"]').getAttribute('aria-selected'), 'true');
    assert.match(await page.locator('[data-ce-candidates]').innerText(), /DEL-102/);
    await go('chapters/09-images/?record=https://example.com'); assert.equal(await page.locator('[data-ce-record]').inputValue(), 'CUST-01');
  });
  const routes = ['', 'chapters/01-introduction/', 'chapters/05-structured-content/', 'chapters/06-information-architecture/', 'chapters/07-processing/', 'chapters/08-ai-native/', 'chapters/09-images/', 'chapters/11-beyond-github/', 'materials/examples/contract-explorer/records/DEL-101/', 'materials/reference/automation-quality/'];
  for (const width of [320, 390, 768, 1440]) await test(`${width}px: page reflow, current menu, diagrams and representative pages`, async () => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await go(route);
      const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
      assert.ok(dimensions.document <= dimensions.viewport + 1, `${width} ${route} clips: ${JSON.stringify(dimensions)}`);
      if (route.startsWith('chapters/')) {
        assert.equal(await page.locator('#chapter-menu [aria-current="page"]').count(), 1);
        assert.match(await page.locator('#chapter-menu > summary').innerText(), /Chapters ·/);
      }
      if (/06-information|07-processing/.test(route)) {
        const list = page.locator('.diagram-relationships'); assert.ok(await list.isVisible());
        assert.ok(await list.evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 16));
        const disclosure = page.locator('.diagram-graphic'); await disclosure.locator('summary').click();
        assert.ok(await disclosure.locator('svg').isVisible()); await disclosure.locator('summary').click();
      }
      if ((width === 390 || width === 1440) && ['', 'chapters/07-processing/', 'materials/examples/contract-explorer/records/DEL-101/'].includes(route)) {
        const name = route === '' ? 'home' : route.startsWith('materials') ? 'record' : 'processing';
        const selector = name === 'home' ? '.home-hero' : name === 'record' ? 'main' : '[data-markdown-playground]';
        await screenshot(`${name}-${width}`, page.locator(selector));
      }
      if ((width === 320 || width === 390) && /06-information|07-processing/.test(route)) await screenshot(`diagram-${route.slice(9,11)}-${width}`, page.locator('.readable-diagram'));
    }
  });
  await test('Desktop → mobile resize preserves source/result and keeps focus visible', async () => {
    await page.setViewportSize({ width: 1440, height: 900 }); await go('chapters/07-processing/');
    const source = page.locator('[data-source]'); await source.fill((await source.inputValue()) + '\n\nResize survives.');
    await source.focus(); await page.setViewportSize({ width: 390, height: 844 });
    await source.waitFor({ state: 'visible' }); await page.waitForFunction(() => !document.querySelector('[data-editor-tabs]').hidden);
    assert.ok(await source.isVisible()); assert.ok(await page.locator('[data-editor-tabs]').isVisible());
    assert.ok(!(await page.locator('#chapter-menu').evaluate(node => node.open)));
    await page.locator('[data-editor-tab="preview"]').click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await source.waitFor({ state: 'visible' });
    assert.ok(await source.isVisible()); assert.ok(await page.locator('[data-preview]').isVisible());
    assert.ok(!(await page.locator('[data-editor-tabs]').isVisible()));
    assert.ok(await page.locator('[data-preview]').evaluate(node => document.activeElement === node));
    assert.match(await source.inputValue(), /Resize survives/);
  });
  await test('200% text enlargement: ordinary content reflows', async () => {
    await page.setViewportSize({ width: 768, height: 900 });
    for (const route of ['', 'chapters/07-processing/', 'materials/examples/contract-explorer/records/DEL-101/']) {
      await go(route); await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route);
    }
    await screenshot('record-text-200');
  });
  await test('No-JavaScript: both editor panels, sources, diagram meaning and all explorer views', async () => {
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const staticPage = await nojs.newPage();
    await staticPage.goto(new URL('chapters/07-processing/', base).href);
    assert.ok(await staticPage.locator('[data-source]').isVisible()); assert.ok(await staticPage.locator('[data-preview]').isVisible());
    assert.equal(await staticPage.locator('[data-editor-tabs]').isVisible(), false);
    assert.ok(await staticPage.locator('.diagram-relationships').isVisible());
    await staticPage.goto(new URL('chapters/09-images/', base).href);
    for (const panel of await staticPage.locator('[data-ce-panel]').all()) assert.ok(await panel.isVisible());
    assert.ok(await staticPage.locator('[data-ce-fallback]').isVisible());
    await nojs.close();
  });
  await test('Slides, notes, legacy routes and dashboard snapshot/failure labels', async () => {
    await go('presentations/information-model/');
    await page.waitForSelector('.reveal.ready'); const before = await page.locator('.slides > section.present').getAttribute('id');
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300);
    assert.notEqual(await page.locator('.slides > section.present').getAttribute('id'), before);
    await go('presentations/information-model/notes/'); assert.ok(await page.locator('main').isVisible());
    await go('chapters/06-processing/'); await page.waitForURL('**/chapters/07-processing/');
    await go('dashboard/'); assert.match(await page.locator('main').innerText(), /snapshot/i);
    assert.match(await page.locator('main').innerText(), /unavailable|not available|not collected/i);
  });
  assert.deepEqual(errors, [], 'No uncaught browser errors'); assert.deepEqual(requests, [], 'No browser writes');
} finally {
  await writeFile(`${evidence}/results.json`, JSON.stringify({ sourceRevision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), workingTree: execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim() ? 'modified' : 'clean', browser: await browser.version(), base, results, errors, nonGetRequests: requests, limitations: ['Local Chromium emulation; no physical device, screen reader, hosted deployment or reader study.', '200% text enlargement and viewport reflow; native browser-UI zoom not automated.'] }, null, 2));
  await browser.close();
}
