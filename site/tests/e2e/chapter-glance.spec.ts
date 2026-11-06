import { test, expect } from '@playwright/test';
import { readdir } from 'node:fs/promises';

const slugs = (await readdir('../docs')).filter(file => file.endsWith('.md')).map(file => file.slice(0,-3));

for (const width of [320, 390, 1440]) {
  test(`At a Glance: all twelve chapters reflow at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of slugs) {
      expect((await page.goto(`chapters/${slug}/`))?.status()).toBe(200);
      const glance = page.getByRole('region', { name: /Chapter \d+ · At a Glance/ });
      await expect(glance).toBeVisible();
      await expect(glance.getByRole('listitem')).toHaveCount(6);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect(await glance.locator('li').evaluateAll(items => items.every(item => item.scrollWidth <= item.clientWidth + 1))).toBe(true);
      if (slug === '10-data-enrichment') await info.attach(`data-chapter-${width}`, {body:await page.screenshot(),contentType:'image/png'});
    }
  });
}

test('At a Glance: accessible names, no-JS reading, text enlargement and keyboard continuity', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled:false, viewport:{ width:390, height:844 } });
  const page = await context.newPage();
  await page.goto(new URL('chapters/10-data-enrichment/', baseURL).href);
  const glance = page.getByRole('region', { name:'Chapter 10 · At a Glance' });
  const snapshot = await glance.ariaSnapshot();
  expect(snapshot).toContain('heading "Chapter 10 · At a Glance" [level=2]');
  for (const title of ['Quality','Annotate','Enrich','Visualize','Review','Preserve']) {
    expect(snapshot).toContain(title);
  }
  await expect(glance.getByRole('listitem')).toHaveCount(6);
  // Explanatory list items are read in order, not treated as six interactive controls.
  await expect(glance.locator('a,button,input,select,[tabindex]')).toHaveCount(0);
  await page.locator('.chapter-information > summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.chapter-information')).toHaveAttribute('open','');
  await expect(page.locator('.chapter-information > summary')).toBeFocused();
  await page.evaluate(() => document.documentElement.style.setProperty('font-size','200%','important'));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await expect(page.getByRole('img', {name:/Durations of three fictional cases/})).toBeVisible();
  await expect(page.locator('main')).toContainText('cannot compare team performance');
  await context.close();
});
