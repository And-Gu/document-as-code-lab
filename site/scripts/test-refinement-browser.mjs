import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.REFINEMENT_TEST_URL || 'http://127.0.0.1:4330/document-as-code-lab/';
const evidence = process.env.REFINEMENT_EVIDENCE_DIR || '../build/package-2-browser';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const results = [], errors = [], external = [];
context.on('request', r => { if (r.method() !== 'GET' || new URL(r.url()).origin !== new URL(base).origin) external.push(`${r.method()} ${r.url()}`); });
const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
const go = async route => { assert.equal((await page.goto(new URL(route, base).href)).status(), 200); await page.waitForLoadState('networkidle'); };
const lab = 'materials/reference/information-refinement/';
const output = page.locator('[data-ref-output]'), forecast = page.locator('#ref-forecast');
const test = async (name, run) => { await run(); results.push({ name, result: 'passed' }); console.log(`PASS ${name}`); };
const shot = async name => page.screenshot({ path: `${evidence}/${name}.png`, fullPage: false });
try {
  await test('Chapter bridge and unresolved mapping preserve independent budget result', async () => {
    await go('chapters/07-processing/'); await page.getByRole('link', { name: 'Information Refinement Lab', exact: true }).click(); await page.waitForLoadState('networkidle');
    assert.match(await output.innerText(), /Identity unresolved/); assert.match(await output.innerText(), /SEK 26,000/);
    assert.equal(await page.locator('h1').count(), 1);
    await shot('initial-390');
  });
  await test('Explicit keyboard build, stale edits, partial output and invalid build retention', async () => {
    await page.getByLabel('Use this mapping in the exercise').focus(); await page.keyboard.press('Space');
    await page.getByRole('button', { name: 'Build briefing', exact: true }).focus(); await page.keyboard.press('Enter');
    assert.match(await output.innerText(), /5 calendar days after/); assert.match(await output.innerText(), /8 hours less/); assert.match(await output.innerText(), /14.4%/);
    const baseline = await output.innerText();
    await forecast.fill('2026-11-11'); assert.equal(await output.innerText(), baseline); assert.match(await page.locator('[data-ref-status]').innerText(), /previous inputs/);
    await page.getByRole('button', { name: 'Build briefing', exact: true }).click(); assert.match(await output.innerText(), /1 calendar day before/);
    await page.locator('[data-ref-include][value="SRC-BUDGET"]').uncheck();
    await page.getByRole('button', { name: 'Build briefing', exact: true }).click(); assert.match(await output.innerText(), /Project cost comparison unavailable/); assert.doesNotMatch(await output.innerText(), /26,000|14.4%/);
    const partial = await output.innerText(); await forecast.fill('2026-11-31'); await page.getByRole('button', { name: 'Build briefing', exact: true }).click();
    assert.match(await page.locator('[data-ref-status]').innerText(), /Build failed.*previous inputs/); assert.equal(await output.innerText(), partial); assert.equal(await forecast.getAttribute('aria-invalid'), 'true');
    assert.equal(await forecast.evaluate(el => el === document.activeElement), true);
    await shot('partial-failed-390');
  });
  await test('Source and original bytes, exact return restores edits and prior build', async () => {
    const previous = await output.innerText();
    await page.getByRole('link', { name: /Inspect source.*Delivery forecast/ }).click(); await page.waitForLoadState('networkidle');
    assert.match(await page.locator('h1').innerText(), /SRC-FORECAST/);
    assert.match(await page.locator('main').innerText(), /facts.forecast_date/);
    const rawUrl = await page.getByRole('link', { name: 'View original source', exact: true }).getAttribute('href');
    assert.deepEqual(await (await context.request.get(new URL(rawUrl, base).href)).body(), await readFile('../examples/information-refinement/sources/SRC-FORECAST.md'));
    await shot('source-390');
    await page.getByRole('link', { name: 'Return to Information Refinement Lab', exact: true }).click(); await page.waitForLoadState('networkidle');
    assert.equal(await forecast.inputValue(), '2026-11-31'); assert.equal(await output.innerText(), previous); assert.match(await page.locator('[data-ref-status]').innerText(), /Build failed/);
  });
  await test('Reset, worked example and deterministic replay use current inputs', async () => {
    await page.getByRole('button', { name: 'Reset practice' }).click(); assert.equal(await forecast.inputValue(), ''); assert.ok(await page.getByLabel('Leave unresolved').isChecked());
    assert.equal(await page.locator('[data-ref-include]:checked').count(), 5); assert.match(await output.innerText(), /Identity unresolved/);
    await page.getByRole('button', { name: 'Show the worked example' }).click(); assert.match(await output.innerText(), /5 calendar days after/);
    await forecast.fill('2026-11-11'); await page.getByRole('button', { name: 'Replay with current practice inputs' }).click();
    assert.match(await output.innerText(), /1 calendar day before/); assert.ok(await page.locator('[data-ref-mode]').isVisible());
    assert.match(await page.locator('[data-ref-replay-status]').innerText(), /deterministic replay, not a live AI run/);
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    await shot('replay-390');
  });
  await test('Catalogue filters and existing DEL-101 entry', async () => {
    await go('materials/reference/knowledge-catalogue/'); assert.equal(await page.locator('[data-catalogue-entry]:visible').count(), 7);
    await page.getByLabel('Question/use').selectOption('Budget'); assert.equal(await page.locator('[data-catalogue-entry]:visible').count(), 1);
    await page.getByLabel('Example', { exact: true }).selectOption('Contract Explorer'); assert.equal(await page.locator('[data-catalogue-entry]:visible').count(), 0);
    await page.getByLabel('Question/use').selectOption(''); assert.equal(await page.locator('[data-catalogue-entry]:visible').count(), 1);
    await page.getByLabel('Source kind').selectOption('Delivery record'); assert.equal(await page.locator('[data-catalogue-entry]:visible').count(), 1);
    await page.getByLabel('Example', { exact: true }).selectOption(''); await page.getByLabel('Source kind').selectOption(''); await shot('catalogue-390');
    await go('chapters/09-images/'); await page.locator('[data-ce-record]').selectOption('DEL-101'); await page.getByRole('link', { name: 'Follow this delivery across sources', exact: true }).click(); await page.waitForLoadState('networkidle'); assert.ok(await page.locator('[data-refinement]').isVisible());
  });
  for (const width of [320, 390, 768, 1440]) await test(`${width}px reflow and readable evidence`, async () => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [lab, 'materials/reference/knowledge-catalogue/', 'materials/examples/information-refinement/sources/SRC-BUDGET/']) {
      await go(route); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route);
    }
    await go(lab); await page.getByRole('button', { name: 'Show the worked example' }).click(); await page.locator('#result-date-comparison summary').click();
    assert.match(await page.locator('#result-date-comparison').innerText(), /facts.forecast_date/);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    if (width === 1440) await shot('worked-1440');
  });
  await test('200% text and no-JavaScript sources, baseline and catalogue', async () => {
    await page.setViewportSize({ width: 768, height: 900 }); await go(lab); await page.addStyleTag({ content: 'html{font-size:200% !important}' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); await shot('text-200');
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } }), p = await nojs.newPage();
    await p.goto(new URL(lab, base).href); assert.match(await p.locator('main').innerText(), /5 calendar days after/); assert.match(await p.locator('main').innerText(), /SEK 26,000/);
    assert.equal(await p.getByRole('link', { name: /^Inspect source/ }).count(), 5);
    await p.goto(new URL('materials/reference/knowledge-catalogue/', base).href); assert.equal(await p.locator('[data-catalogue-entry]:visible').count(), 7); await nojs.close();
  });
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
} finally {
  await writeFile(`${evidence}/results.json`, JSON.stringify({ sourceRevision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), workingTree: execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim() ? 'modified' : 'clean', browser: await browser.version(), base, results, errors, external, limitations: ['Local Chromium only; not hosted, a screen reader test, physical device or reader study.', '200% CSS text enlargement, not native browser UI zoom.'] }, null, 2));
  await browser.close();
}
