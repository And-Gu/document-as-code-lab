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
      const quizAnchor = page.locator('#chapter-quiz-widget');
      const quiz = quizAnchor.getByRole('region', { name: 'Check your understanding' });
      const navigation = page.locator('.chapter-navigation');
      if (slug === '13-course-summary' || slug === '13-explorable-presentations') {
        await expect(quiz).toHaveCount(0);
        await expect(navigation.getByRole('link', { name: /^Back to/ })).toHaveAttribute('href', /\/$/);
      } else {
        await expect(quiz.getByRole('heading', { level: 2 })).toBeVisible();
        await expect(page.locator('main [data-learning-quiz]')).toHaveCount(1);
        const contents = page.locator('.chapter-contents');
        if (await contents.count()) {
          const quizLink = contents.getByRole('link', { name: 'Check your understanding' });
          await expect(quizLink).toHaveAttribute('href', '#chapter-quiz-widget');
          await quizLink.click();
          await expect(page).toHaveURL(/#chapter-quiz-widget$/);
          await expect(quiz.getByRole('heading', { level: 2 })).toBeInViewport();
        }
        const next = navigation.getByRole('link', { name: /^Next:/ });
        const destination = await next.getAttribute('href');
        expect(destination).toBeTruthy();
        const inlineNext = page.locator(`article a[href=${JSON.stringify(destination)}]`).last();
        expect(await inlineNext.evaluate((link) => {
          const anchor = document.getElementById('chapter-quiz-widget')!;
          return Boolean(anchor.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING);
        })).toBe(true);
      }
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

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const mobile = viewport.width === 390;
  test.describe(`Quiz flow at ${viewport.width}px`, () => {
    test.use({ viewport, hasTouch: mobile, isMobile: mobile });

    for (const slug of ['02-github-workspace', '05-structured-content']) {
      test(`can review an incorrect answer and return to the score in ${slug}`, async ({ page, browserName }, info) => {
        await page.goto(`chapters/${slug}/`);
        const quiz = page.getByRole('region', { name: 'Check your understanding' });
        const submit = quiz.getByRole('button', { name: 'Check answers' });
        const reset = quiz.getByRole('button', { name: 'Try again' });
        const review = quiz.getByRole('button', { name: 'Review first incorrect answer' });
        const back = quiz.getByRole('button', { name: 'Back to quiz score' });
        const score = quiz.locator('[data-score]');
        const questions = quiz.getByRole('group');
        const firstOption = questions.first().getByRole('radio').first();
        const input = JSON.parse(await quiz.locator('[data-questions]').textContent() ?? '[]') as {
          correct: string[];
          options: { value: string; label: string }[];
        }[];
        const activate = (control: typeof submit) => mobile ? control.tap() : control.press('Enter');
        // On macOS, WebKit's Option-Tab visits clickable controls in the default keyboard mode.
        const nextControl = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
        const select = async (index: number, label: string) => {
          const radio = questions.nth(index).getByRole('radio', { name: label, exact: true });
          if (mobile) await radio.tap();
          else await radio.press('Space');
        };

        const heading = quiz.getByRole('heading', { level: 2 });
        await expect(heading).toBeVisible();
        await heading.evaluate((element) => element.scrollIntoView({ block: 'center' }));
        await info.attach('quiz-entry', { body: await page.screenshot(), contentType: 'image/png' });
        await activate(submit);
        await expect(firstOption).toBeFocused();
        await expect(score).toHaveText('Answer each question before checking your answers.');
        await expect(review).toHaveCount(0);

        for (const [index, question] of input.entries()) {
          const option = question.options.find(({ value }) => question.correct.includes(value) === (index !== 0));
          await select(index, option!.label);
        }
        await activate(submit);
        await expect(score).toHaveText(`${input.length - 1} of ${input.length} correct.`);
        await expect(score).toBeFocused();
        await expect(review).toBeInViewport();
        if (!mobile) {
          await page.keyboard.press(nextControl);
          await expect(review).toBeFocused();
        }
        await activate(review);
        const incorrect = quiz.locator('[data-feedback][data-result="incorrect"]');
        await expect(incorrect).toBeFocused();
        await expect(incorrect).toBeInViewport();
        if (!mobile) {
          await page.keyboard.press(nextControl);
          await expect(back).toBeFocused();
        }
        await activate(back);
        await expect(score).toBeFocused();
        await expect(score).toBeInViewport();
        await expect(quiz.locator('input:checked')).toHaveCount(input.length);
        await info.attach('quiz-result', { body: await page.screenshot(), contentType: 'image/png' });

        const correct = input[0].options.find(({ value }) => input[0].correct.includes(value));
        await select(0, correct!.label);
        await expect(review).toHaveCount(0);
        await activate(submit);
        await expect(score).toHaveText(`${input.length} of ${input.length} correct.`);
        await expect(review).toHaveCount(0);
        await activate(reset);
        await expect(firstOption).toBeFocused();
        await expect(quiz.locator('input:checked')).toHaveCount(0);
        await expect(score).toBeEmpty();
      });
    }
  });
}
