import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const lab = 'materials/reference/information-refinement/';
async function go(page: Page, route: string) { expect((await page.goto(route))?.status()).toBe(200); await page.waitForLoadState('networkidle'); }
async function reflow(page: Page) { expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true); }
for (const width of [390,1440]) test.describe(`${width}px`, () => {
  test.use({ viewport:{width,height:900} });
  test.beforeEach(async ({ page }, info) => {
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    // Attach the browser engine/version, viewport and timestamp to each observation.
    info.annotations.push({ type:'environment', description:JSON.stringify({browser:page.context().browser()?.version(),width,timestamp:new Date().toISOString()}) });
    (page as Page & { verificationErrors?: string[] }).verificationErrors = errors;
  });
  test.afterEach(async ({ page }, info) => {
    expect((page as Page & { verificationErrors?: string[] }).verificationErrors).toEqual([]);
    if (info.status === info.expectedStatus && /J[1346]/.test(info.title)) await info.attach('rendered-view', { body:await page.screenshot(), contentType:'image/png' });
  });
  test('J1 homepage discovers the processing demonstration', async ({ page }) => {
    await go(page, './'); await page.getByRole('link',{name:'See one source change several results'}).click();
    await expect(page).toHaveURL(/chapters\/07-processing\/#processing-lab-widget$/);
    const source = page.locator('[data-source]'); await expect(source).toBeVisible();
    await expect(page.locator('[data-process-handbook]')).not.toHaveText(await source.inputValue());
    await expect(page.locator('h1')).toHaveCount(1);
  });
  test('J2 processing edits, invalid build, recovery and reset', async ({ page }) => {
    await go(page,'chapters/07-processing/');
    const source = page.locator('[data-source]'), result = page.locator('[data-process-handbook]');
    const original = await source.inputValue(), last = await result.innerText();
    await source.fill(original+'\n\nA changed practice sentence.'); await expect(page.locator('[data-process-status]')).toContainText('last successful');
    await source.fill(original.replace('owner: people-team\n','')); await page.locator('[data-process-build]').click();
    await expect(page.locator('[data-process-status]')).toHaveAttribute('data-state','invalid'); await expect(result).toHaveText(last);
    await source.fill(original+'\n\nA changed practice sentence.'); await page.locator('[data-process-build]').click(); await expect(result).toContainText('A changed practice sentence.');
    await page.locator('[data-reset]').click(); await expect(source).toHaveValue(original); await expect(source).toBeFocused();
  });
  test('J3 Contract Explorer source identity, exact bytes and relevant return', async ({ page,request }) => {
    await go(page,'chapters/09-images/'); await page.locator('[data-ce-record]').selectOption('DEL-101'); await page.getByRole('link',{name:'Read source record',exact:true}).click();
    await expect(page.locator('h1')).toHaveText('DEL-101 — Interface package');
    for (const text of ['10 November 2026','Planned','PRJ-101','Belongs to']) await expect(page.locator('main')).toContainText(text);
    const href = await page.getByRole('link',{name:'View original source'}).getAttribute('href');
    expect(await (await request.get(href!)).body()).toEqual(await readFile('../examples/contract-explorer/records/DEL-101.md'));
    await page.getByRole('link',{name:'Return to Contract Explorer'}).click(); await expect(page.locator('[data-ce-record]')).toHaveValue('DEL-101');
  });
  test('J4 source, mapping and computed briefing with preserved return context', async ({ page }) => {
    await go(page,lab); await expect(page.locator('[data-ref-output]')).toContainText('Identity unresolved');
    await page.getByLabel('Use this mapping in the exercise').check(); await page.getByRole('button',{name:'Build briefing',exact:true}).click();
    const output = page.locator('[data-ref-output]');
    for (const text of ['5 calendar days after','8 hours less','SEK 26,000 above baseline (14.4%)']) await expect(output).toContainText(text);
    await page.getByRole('link',{name:/Inspect source.*Delivery forecast/}).click(); await expect(page.locator('main')).toContainText('facts.forecast_date');
    await page.getByRole('link',{name:'Return to Information Refinement Lab',exact:true}).click(); await expect(output).toContainText('5 calendar days after'); await expect(page.getByLabel('Use this mapping in the exercise')).toBeChecked();
  });
  test('J5 missing budget, changed forecast, failed and stale builds', async ({ page }) => {
    await go(page,lab); await page.getByRole('button',{name:'Show the worked example'}).click();
    const result = page.locator('[data-ref-output]'), prior = await result.innerText();
    await page.locator('#ref-forecast').fill('2026-11-11'); await page.locator('[data-ref-include][value="SRC-BUDGET"]').uncheck();
    await expect(page.locator('[data-ref-status]')).toContainText('previous inputs'); await expect(result).toHaveText(prior);
    await page.getByRole('button',{name:'Build briefing',exact:true}).click(); await expect(result).toContainText('1 calendar day before'); await expect(result).toContainText('Project cost comparison unavailable'); await expect(result).not.toContainText('26,000');
    const partial = await result.innerText(); await page.locator('#ref-forecast').fill('2026-11-31'); await page.getByRole('button',{name:'Build briefing',exact:true}).click(); await expect(result).toHaveText(partial); await expect(page.locator('[data-ref-status]')).toContainText('Build failed');
    await page.getByRole('button',{name:'Reset practice'}).click(); await expect(page.getByLabel('Leave unresolved')).toBeChecked();
  });
  test('J6 illustrative agent keeps authority and makes no model/external request', async ({ page,baseURL }) => {
    const unexpected: string[] = []; page.on('request', r => { if (r.method() !== 'GET' || new URL(r.url()).origin !== new URL(baseURL!).origin) unexpected.push(r.url()); });
    await go(page,lab); await expect(page.locator('#agent-workflow')).toContainText('deterministic replay, not a live AI run'); await expect(page.locator('#agent-workflow')).toContainText('Do not change sources, contact the customer or approve a new date.');
    await page.getByLabel('Use this mapping in the exercise').check(); await page.locator('#ref-forecast').fill('2026-11-11'); await page.getByRole('button',{name:'Replay with current practice inputs'}).click();
    await expect(page.locator('[data-ref-mode]')).toBeVisible(); await expect(page.locator('[data-ref-output]')).toContainText('1 calendar day before'); expect(unexpected).toEqual([]);
  });
  test('J7 fresh responsive navigation, diagrams and keyboard source/preview', async ({ page }) => {
    await go(page,'chapters/07-processing/'); await reflow(page); await expect(page.locator('.diagram-relationships')).toBeVisible();
    const source = page.locator('[data-source]'), initial = await source.inputValue(); await source.fill(initial+'\n\nPreserved edit.');
    if (width===390) {
      await page.locator('[data-editor-tab="source"]').focus(); await page.keyboard.press('ArrowRight'); await expect(page.locator('[data-preview]')).toBeVisible(); await expect(source).not.toBeVisible();
      await page.keyboard.press('Home'); await page.keyboard.press('Tab'); await expect(source).toBeFocused();
      await page.locator('#chapter-menu > summary').focus(); await page.keyboard.press('Enter'); await expect(page.locator('#chapter-menu')).toHaveAttribute('open','');
    }
    await expect(source).toHaveValue(initial+'\n\nPreserved edit.');
  });
  test('J8 slides, notes, legacy routes and explicit dashboard API failure', async ({ page }) => {
    await go(page,'presentations/information-model/'); await page.locator('.reveal.ready').waitFor(); const before = await page.locator('.slides > section.present').getAttribute('id'); await page.keyboard.press('ArrowRight'); await expect(page.locator('.slides > section.present')).not.toHaveAttribute('id',before!);
    await go(page,'presentations/information-model/notes/'); await expect(page.locator('main')).toBeVisible();
    await go(page,'chapters/06-processing/'); await expect(page).toHaveURL(/chapters\/07-processing\/$/);
    await page.route('https://api.github.com/**',route=>route.fulfill({status:503,contentType:'application/json',body:'{"message":"Controlled verification failure"}'}));
    await go(page,'dashboard/'); await expect(page.locator('main')).toContainText('Published snapshots'); await page.locator('#dashboard-live-refresh').click(); await expect(page.locator('#dashboard-announcement')).toContainText('need attention'); await expect(page.locator('main')).toContainText(/unavailable|503|failed/i);
  });
});
test('P3-01 production identity and genuine missing-route errors', async ({ request },info) => {
  const response = await request.get('build-information.json'); expect(response.status()).toBe(200);
  const manifest = await response.json(); expect(Object.keys(manifest).sort()).toEqual(['built_at','schema_version','source_commit']); expect(manifest.schema_version).toBe(1);
  expect(manifest.source_commit).toBe(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()); expect(Number.isFinite(Date.parse(manifest.built_at))).toBe(true);
  await info.attach('build-information',{body:JSON.stringify(manifest),contentType:'application/json'});
  for(const route of ['does-not-exist/','missing.js','/outside-base/']) expect((await request.get(route)).status()).toBe(404);
  expect((await request.post('./')).status()).toBe(405);
});
test('P3-01 resize, 320/768 reflow, 200% text and no-JavaScript baseline',async({page,browser,baseURL})=>{
  await page.setViewportSize({width:1440,height:900}); await go(page,'chapters/07-processing/'); const source=page.locator('[data-source]'); await source.fill((await source.inputValue())+'\n\nResize survives.'); await source.focus();
  await page.setViewportSize({width:390,height:844}); await expect(source).toBeVisible(); await expect(source).toBeFocused(); await expect(source).toHaveValue(/Resize survives/);
  for(const width of [320,768]) { await page.setViewportSize({width,height:900}); for(const route of ['chapters/06-information-architecture/',lab,'materials/reference/knowledge-catalogue/']) {await go(page,route);await reflow(page);} }
  await page.addStyleTag({content:'html{font-size:200% !important}'}); await reflow(page);
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}), staticPage=await context.newPage();
  await staticPage.goto(new URL(lab,baseURL).href);
  await expect(staticPage.locator('main')).toContainText('SEK 26,000'); await expect(staticPage.locator('main')).toContainText('5 calendar days after'); await context.close();
});
