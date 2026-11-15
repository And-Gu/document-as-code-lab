import { test, expect } from '@playwright/test';
import { readdir } from 'node:fs/promises';

const slugs = (await readdir('../docs')).filter(file => file.endsWith('.md')).map(file => file.slice(0,-3));

for (const width of [320, 390, 1440]) {
  test(`All ${slugs.length} chapters reflow at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of slugs) {
      expect((await page.goto(`chapters/${slug}/`))?.status()).toBe(200);
      await expect(page.locator('main article h1')).toBeVisible();
      await expect(page.locator('.chapter-glance')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (slug === '10-data-enrichment') await info.attach(`data-chapter-${width}`, {body:await page.screenshot(),contentType:'image/png'});
    }
  });
}

test('Data enrichment chapter supports reading without JavaScript, text enlargement and keyboard access', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled:false, viewport:{ width:390, height:844 } });
  const page = await context.newPage();
  await page.goto(new URL('chapters/10-data-enrichment/', baseURL).href);
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
