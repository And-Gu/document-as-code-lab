import { test, expect } from '@playwright/test';

const decks = [
  { slug: 'document-as-code', count: 8, last: 'start-small' },
  { slug: 'information-model', count: 10, last: 'first-use' },
  { slug: 'information-value', count: 10, last: 'pilot' },
  { slug: 'lab-architecture', count: 9, last: 'closing' },
];

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`all decks retain readable slides and working links at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const deck of decks) {
      await page.goto(`presentations/${deck.slug}/?view=slide`);
      await expect(page.locator('.reveal.ready')).toBeVisible();
      await expect(page.locator('section.course-slide')).toHaveCount(deck.count);
      for (let i = 0; i < deck.count; i++) {
        const current = page.locator('section.course-slide.present');
        await expect(current).toBeVisible();
        const fits = await current.evaluate((slide) => {
          const content = slide.querySelector('.slide-body')!.getBoundingClientRect();
          const sources = slide.querySelector('.slide-sources')!.getBoundingClientRect();
          return { contentEnd: content.bottom, sourceStart: sources.top, width: slide.scrollWidth, client: slide.clientWidth };
        });
        expect(fits.contentEnd, `${deck.slug} slide ${i + 1} overlaps sources`).toBeLessThanOrEqual(fits.sourceStart + 2);
        expect(fits.width).toBeLessThanOrEqual(fits.client + 2);
        for (const href of await current.locator('.slide-sources a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
          expect(href).toMatch(/^\/document-as-code-lab\/chapters\//);
        }
        if (i < deck.count - 1) {
          const id = await current.getAttribute('id');
          await page.keyboard.press('ArrowRight');
          await expect(current).not.toHaveAttribute('id', id!);
        }
      }
      await expect(page.locator('section.course-slide.present')).toHaveAttribute('id', deck.last);
      await page.getByRole('button', { name: 'Slide overview', exact: true }).click();
      await expect(page.locator('.reveal')).toHaveClass(/overview/);
      await page.keyboard.press('Escape');
      await expect(page.locator('.reveal')).not.toHaveClass(/overview/);
      await page.getByRole('link', { name: 'Notes', exact: true }).click();
      await expect(page.locator('main section')).toHaveCount(deck.count);
    }
    expect(errors).toEqual([]);
  });
}

test('concept deck scrolls, changes selection, retains hashes and switches views', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('presentations/information-model/#/metadata');
  await expect(page.locator('body')).toHaveClass(/reveal-scroll/);
  const slide = page.locator('#metadata');
  await expect(slide).toBeInViewport();
  await expect(slide.getByRole('status')).toContainText('2 of 3');
  await slide.getByRole('button', { name: 'Include drafts', exact: true }).click();
  await expect(slide.getByRole('status')).toContainText('3 of 3');
  await expect(slide.getByRole('status')).toContainText('Review copy');
  await page.getByRole('button', { name: 'Switch to slide view' }).click();
  await expect(page.locator('body')).not.toHaveClass(/reveal-scroll/);
  await expect(page.locator('section.course-slide.present')).toHaveAttribute('id', 'metadata');
  await expect(slide.getByRole('status')).toContainText('2 of 3');
  await slide.getByRole('button', { name: 'Include drafts', exact: true }).click();
  await expect(slide.getByRole('status')).toContainText('3 of 3');
  await slide.getByRole('button', { name: 'Approved only', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(slide.getByRole('status')).toContainText('2 of 3');
  await expect(page.locator('section.course-slide.present')).toHaveAttribute('id', 'metadata');
  await page.reload();
  await expect(page.locator('.reveal.ready')).toBeVisible();
  await expect(page.locator('body')).not.toHaveClass(/reveal-scroll/);
  await expect(page.locator('section.course-slide.present')).toHaveAttribute('id', 'metadata');
  await page.getByRole('button', { name: 'Switch to scroll view' }).click();
  await expect(page.locator('body')).toHaveClass(/reveal-scroll/);
  await page.locator('#first-use').scrollIntoViewIfNeeded();
  await expect(page.locator('#first-use')).toBeInViewport();
  await page.getByRole('button', { name: 'Switch to slide view' }).click();
  await expect(page.locator('section.course-slide.present')).toHaveAttribute('id', 'first-use');
  await expect(page).toHaveURL(/#\/first-use$/);
  expect(errors).toEqual([]);
});

test('scroll mode works on a phone and can be selected by URL on other decks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('presentations/information-model/#/metadata');
  await expect(page.locator('body')).toHaveClass(/reveal-scroll/);
  await expect(page.locator('#metadata')).toBeInViewport();
  await expect.poll(async () => (await page.locator('#metadata h2').boundingBox())?.y).toBeLessThan(200);
  await page.locator('#metadata').getByRole('button', { name: 'Include drafts', exact: true }).click();
  await expect(page.locator('#metadata').getByRole('status')).toContainText('3 of 3');
  await page.goto('presentations/information-value/?view=scroll');
  await expect(page.locator('body')).toHaveClass(/reveal-scroll/);
  await page.locator('#pilot').scrollIntoViewIfNeeded();
  await expect(page.locator('#pilot')).toBeInViewport();
});

test('source links, notes and all slide content remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const deck of decks) {
    await page.goto(`http://127.0.0.1:${process.env.E2E_PORT || 4340}/document-as-code-lab/presentations/${deck.slug}/`);
    await expect(page.locator('section.course-slide')).toHaveCount(deck.count);
    const last = page.locator(`#${deck.last}`);
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport();
    await last.locator('.slide-sources a').first().click();
    await expect(page.locator('main h1')).toBeVisible();
  }
  await context.close();
});

test('relationship boxes explain and highlight direct connections on hover and keyboard focus', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const view of ['slide', 'scroll']) {
    await page.goto(`presentations/information-model/?view=${view}#/relationships`);
    await expect(page.locator('.reveal.ready')).toBeVisible();
    const slide = page.locator('section#relationships');
    const graph = slide.locator('.relationship-graphic');
    await expect(graph).toBeInViewport();
    const nodes = [
      { id: 'handbook', name: 'Handbook', text: 'The handbook includes Access' },
      { id: 'access', name: 'Access, PROC-001', text: 'Access (PROC-001) is included' },
      { id: 'equipment', name: 'Equipment, PROC-002', text: 'Equipment (PROC-002) is included' },
      { id: 'policy', name: 'Security policy, POL-001', text: 'A policy change identifies both for review.' },
    ];
    for (const node of nodes) {
      await graph.getByRole('button', { name: node.name, exact: true }).hover();
      await expect(graph).toHaveAttribute('data-active', node.id);
      await expect(slide.getByRole('status')).toContainText(node.text);
      await expect.poll(() => graph.locator('.relationship-edge').evaluateAll((edges, active) =>
        edges.every(edge => Number(getComputedStyle(edge).opacity) ===
          (edge.getAttribute('data-from') === active || edge.getAttribute('data-to') === active ? 1 : .25)), node.id)).toBe(true);
    }
    await slide.getByRole('heading').hover();
    await expect(graph).toHaveAttribute('data-active', '');
    const access = graph.getByRole('button', { name: 'Access, PROC-001', exact: true });
    await access.focus();
    await expect(graph).toHaveAttribute('data-active', 'access');
    await page.keyboard.press('Tab');
    await expect(graph.getByRole('button', { name: 'Equipment, PROC-002', exact: true })).toBeFocused();
    await expect(graph).toHaveAttribute('data-active', 'equipment');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await expect(graph).toHaveAttribute('data-active', 'equipment');
    await expect(slide).toBeInViewport();
    // Text labels must sit above their horizontal connector with a clear gap.
    const labelClearance = await graph.locator('.relationship-edge').evaluateAll(edges => edges.map(edge => {
      const text = edge.querySelector('text')!.getBBox();
      const path = edge.querySelector('path')!.getAttribute('d')!;
      const horizontalY = Number(path.match(/(?:M\d+ |V)(\d+)H/)![1]);
      return horizontalY - (text.y + text.height);
    }));
    expect(Math.min(...labelClearance)).toBeGreaterThan(12);
  }
  expect(errors).toEqual([]);
});

test('relationship boxes respond to taps on a narrow touchscreen', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${process.env.E2E_PORT || 4340}/document-as-code-lab/presentations/information-model/#/relationships`);
  await expect(page.locator('.reveal.ready')).toBeVisible();
  const slide = page.locator('section#relationships');
  const graph = slide.locator('.relationship-graphic');
  await graph.getByRole('button', { name: 'Security policy, POL-001', exact: true }).tap();
  await expect(slide.getByRole('status')).toContainText('A policy change identifies both for review.');
  await expect(graph).toHaveAttribute('data-active', 'policy');
  await graph.getByRole('button', { name: 'Handbook', exact: true }).tap();
  await expect(slide.getByRole('status')).toContainText('The handbook includes Access');
  await expect(graph).toHaveAttribute('data-active', 'handbook');
  await expect(slide).toBeInViewport();
  await context.close();
});
