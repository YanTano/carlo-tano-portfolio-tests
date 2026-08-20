// tests/smoke/smoke.spec.js
// Fast, high-value checks that the site is up and the critical shell renders.

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const testData = require('../../test-data/testData.json');
const { SITE_URL } = require('../../utils/constants');

test.describe('Smoke: site availability', () => {
  test('homepage loads successfully with a 200 response', async ({ page }) => {
    const response = await page.goto(SITE_URL);
    expect(response.status()).toBeLessThan(400);
  });

  test('page title contains the expected name', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveTitle(new RegExp(testData.site.titlePattern));
  });

  test('hero section renders with heading and CTA buttons', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.heroSection).toBeVisible();
    await expect(home.heroHeading).toBeVisible();
    await expect(home.heroHeading).toContainText('Carlo Tano');
    await expect(home.hireMeButton).toBeVisible();
    await expect(home.viewProjectsButton).toBeVisible();
  });

  test('navbar is visible with all expected links', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.logo).toBeVisible();
    await expect(home.desktopNavLinks).toHaveCount(testData.site.expectedNavItems.length);

    const texts = await home.desktopNavLinks.allInnerTexts();
    for (const item of testData.site.expectedNavItems) {
      expect(texts).toContain(item);
    }
  });

  test('all main content sections are present in the DOM', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    for (const id of testData.site.expectedSections) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('footer renders with copyright and social links', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.scrollToFooter();

    await expect(home.footer).toBeVisible();
    await expect(home.footerSocialLinks.github).toBeVisible();
    await expect(home.footerSocialLinks.linkedin).toBeVisible();
    await expect(home.footerSocialLinks.facebook).toBeVisible();
    await expect(home.footerSocialLinks.email).toBeVisible();
  });
});
