import { test, expect } from '../fixtures/test-fixtures';

const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1440, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
];

for (const bp of breakpoints) {
  test.describe(`Layout @ ${bp.name} (${bp.width}x${bp.height})`, () => {
    test.use({ viewport: { width: bp.width, height: bp.height } });

    test('no horizontal overflow on the page', async ({ page, homePage }) => {
      await homePage.goto();
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(hasOverflow, 'page should not scroll horizontally').toBe(false);
    });

    test('hero heading and CTA are visible without console errors', async ({ page, homePage }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));

      await homePage.goto();
      await expect(homePage.heroHeading).toBeVisible();
      await expect(homePage.hireMeBtn).toBeVisible();

      expect(errors, `unexpected JS errors: ${errors.join(', ')}`).toHaveLength(0);
    });

    test('correct nav pattern for this breakpoint', async ({ homePage }) => {
      await homePage.goto();
      if (bp.width < 768) {
        await expect(homePage.mobileMenuBtn).toBeVisible();
      } else {
        await expect(homePage.navLinks.first()).toBeVisible();
      }
    });
  });
}
