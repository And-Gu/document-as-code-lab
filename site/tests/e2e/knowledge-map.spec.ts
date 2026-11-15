import { test, expect } from '@playwright/test';

for (const route of ['knowledge-map/', 'chapters/09-images/']) test(`The graph settles after loading and interaction on ${route}`, async ({ page }) => {
  // Sprite labels use a 2D canvas texture. Repainting unchanged labels while idle
  // exposes update loops even when the camera happens to look steady.
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.fillText;
    const counts = { metadata: 0 };
    Object.assign(window, { mapLabelDraws: counts });
    CanvasRenderingContext2D.prototype.fillText = function (...args: Parameters<typeof original>) {
      if (args[0] === 'Metadata') counts.metadata++;
      return original.apply(this, args);
    };
  });
  let navigations = 0;
  page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations++; });
  await page.goto(route);
  await expect(page.locator('[data-knowledge-map]')).toHaveAttribute('data-ready', 'true');
  const draws = () => page.evaluate(() => (window as unknown as { mapLabelDraws: { metadata: number } }).mapLabelDraws.metadata);
  const expectSettled = async () => {
    // Let the initial camera transition and label creation finish, then observe
    // a further idle interval rather than testing only the first rendered frame.
    await page.waitForTimeout(1000);
    const before = await draws();
    expect(before).toBeGreaterThan(0);
    await page.waitForTimeout(1200);
    expect(await draws()).toBe(before);
  };
  await expectSettled();
  await page.locator('[data-concept-connections]').getByRole('button', { name: 'Processing', exact: true }).click();
  await expectSettled();
  await page.getByLabel('Course section', { exact: true }).selectOption('2');
  await page.getByRole('button', { name: '2D', exact: true }).click();
  await expectSettled();
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.getByRole('button', { name: '3D', exact: true }).click();
  await expectSettled();
  expect(navigations).toBe(1);
});

test('The reader keeps their camera position when selecting a concept', async ({ page }, testInfo) => {
  // Disable damping/transitions so the pixel comparison measures camera resets,
  // rather than the intentional easing after a drag.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('chapters/09-images/');
  await expect(page.locator('[data-knowledge-map]')).toHaveAttribute('data-ready', 'true');
  const canvas = page.locator('[data-map-canvas] canvas');
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const openingView = await canvas.screenshot();
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width / 2 + 100, bounds.y + bounds.height / 2 + 40, { steps: 10 });
  await page.mouse.up();
  await page.mouse.move(0, 0);
  const readerView = await canvas.screenshot();
  expect(readerView.equals(openingView)).toBe(false);
  // Reselect the same concept: labels stay identical, exposing camera movement.
  const search = page.getByRole('searchbox', { name: 'Find a concept' });
  await search.fill('Metadata');
  await page.locator('#concept-results').getByRole('button', { name: 'Metadata', exact: true }).click();
  await expect(page.locator('[data-concept-title]')).toHaveText('Metadata');
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1200);
  const selectedView = await canvas.screenshot();
  await testInfo.attach('reader-view', { body: readerView, contentType: 'image/png' });
  await testInfo.attach('selected-view', { body: selectedView, contentType: 'image/png' });
  expect(selectedView.equals(readerView)).toBe(true);
});

for (const route of ['knowledge-map/', 'chapters/09-images/']) test(`Find a concept, follow a relationship and read the relevant chapter from ${route}`, async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(route);
  await expect(page.locator('[data-knowledge-map]')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('[data-map-canvas] canvas')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Find a concept' }).fill('AI agent');
  await page.getByRole('searchbox', { name: 'Find a concept' }).press('Enter');
  await expect(page.locator('[data-concept-title]')).toHaveText('AI agent');
  await page.locator('[data-concept-connections]').getByRole('button', { name: 'Context', exact: true }).click();
  await expect(page.locator('[data-concept-title]')).toHaveText('Context');
  await page.locator('[data-concept-reading] a').click();
  await expect(page).toHaveURL(/chapters\/08-ai-native\/#give-the-agent-context-it-can-use$/);
  await expect(page.locator('#give-the-agent-context-it-can-use')).toBeVisible();
  expect(errors).toEqual([]);
});

test('The map supports section filtering, flat view, reset and narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('chapters/09-images/');
  const map = page.locator('[data-knowledge-map]');
  await expect(map).toHaveAttribute('data-ready', 'true');
  await page.getByLabel('Course section', { exact: true }).selectOption('3');
  await expect(page.locator('[data-map-status]')).toContainText('8 concepts shown');
  await page.getByRole('button', { name: '2D', exact: true }).click();
  await expect(map).toHaveAttribute('data-dimensions', '2');
  await page.getByRole('button', { name: 'Reset view' }).click();
  await expect(page.getByLabel('Course section', { exact: true })).toHaveValue('');
  await expect(page.locator('[data-concept-title]')).toHaveText('Metadata');
  await page.getByRole('button', { name: '3D', exact: true }).click();
  await expect(map).toHaveAttribute('data-dimensions', '3');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('All concepts and reading links remain available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(new URL('chapters/09-images/', baseURL).href);
  await page.locator('#concept-directory > summary').click();
  await expect(page.locator('#concept-metadata')).toContainText('Schema defines rules for Metadata');
  await page.locator('#concept-metadata').getByRole('link', { name: /Chapter 5/ }).click();
  await expect(page.locator('#metadata-information-about-information')).toBeVisible();
  await context.close();
});

test('Search and reading still work when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.startsWith('webgl') || type === 'experimental-webgl') return null;
      return original.apply(this, [type, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await page.goto('chapters/09-images/');
  await expect(page.locator('[data-knowledge-map]')).toHaveAttribute('data-ready', 'fallback');
  await page.getByRole('searchbox', { name: 'Find a concept' }).fill('Markdown');
  await page.getByRole('searchbox', { name: 'Find a concept' }).press('Enter');
  await expect(page.locator('[data-concept-title]')).toHaveText('Markdown');
  await expect(page.locator('[data-concept-reading] a')).toHaveAttribute('href', /chapters\/04-markdown/);
});


test('Chapter 9 puts one graph before its explanation and uses the chapter width for prose', async ({ page }) => {
  await page.goto('chapters/09-images/');
  const map = page.locator('#knowledge-map-widget [data-knowledge-map]');
  await expect(map).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('[data-knowledge-map]')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('[data-contract-explorer]')).toHaveCount(0);
  expect(await page.locator('#knowledge-map-widget').evaluate(element =>
    Boolean(element.compareDocumentPosition(document.querySelector('#from-metadata-to-a-useful-view')!) & Node.DOCUMENT_POSITION_FOLLOWING)
  )).toBe(true);
  await page.locator('[data-concept-connections]').getByRole('button', { name: 'Processing', exact: true }).click();
  await expect(page.locator('[data-concept-title]')).toHaveText('Processing');
  await page.locator('[data-concept-connections]').getByRole('button', { name: 'Derived view', exact: true }).click();
  await page.locator('[data-concept-reading] a').click();
  await expect(page.locator('#follow-a-question-through-the-graph')).toBeVisible();
  await expect(page.locator('[data-knowledge-map]')).toHaveCount(1);
});
