// tests/regression/regression.spec.js
// Broader cross-cutting checks: responsive layout, external link
// reachability, and basic accessibility hygiene. Meant to run on every
// build to catch regressions across the whole page rather than one
// feature at a time.

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const testData = require('../../test-data/testData.json');
const { isLinkReachable } = require('../../utils/linkChecker');

test.describe('Regression: responsive layout', () => {
  test('desktop viewport shows the full nav and hides the hamburger button', async ({ page }) => {
    await page.setViewportSize(testData.viewports.desktop);
    const home = new HomePage(page);
    await home.goto();

    await expect(home.desktopNavLinks.first()).toBeVisible();
    await expect(home.mobileMenuButton).toBeHidden();
  });

  test('mobile viewport hides the desktop nav and shows the hamburger button', async ({ page }) => {
    await page.setViewportSize(testData.viewports.mobile);
    const home = new HomePage(page);
    await home.goto();

    await expect(home.mobileMenuButton).toBeVisible();
    await expect(home.desktopNavLinks.first()).toBeHidden();
  });

  test('tablet viewport renders the hero section without horizontal overflow', async ({ page }) => {
    await page.setViewportSize(testData.viewports.tablet);
    const home = new HomePage(page);
    await home.goto();

    await expect(home.heroSection).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1px rounding tolerance
  });

  test('hero portrait image loads correctly on all breakpoints', async ({ page }) => {
    for (const viewport of Object.values(testData.viewports)) {
      await page.setViewportSize(viewport);
      const home = new HomePage(page);
      await home.goto();
      await expect(home.heroPortrait).toBeVisible();
      const naturalWidth = await home.heroPortrait.evaluate((img) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Regression: external link validation', () => {
  test('social and resume links resolve without error', async ({ page, request }) => {
    const home = new HomePage(page);
    await home.goto();

    const linksToCheck = [
      testData.site.socialLinks.github,
      testData.site.socialLinks.linkedin,
    ];

    for (const url of linksToCheck) {
      const reachable = await isLinkReachable(request, url);
      expect(reachable, `Expected ${url} to be reachable`).toBe(true);
    }
  });

  test('resume PDF resolves successfully', async ({ page, request, baseURL }) => {
    const home = new HomePage(page);
    await home.goto();
    const href = await home.resumeButton.getAttribute('href');
    const resumeUrl = new URL(href, baseURL).toString();

    const response = await request.get(resumeUrl);
    expect(response.status()).toBeLessThan(400);
    expect(response.headers()['content-type']).toContain('pdf');
  });
});

test.describe('Regression: basic accessibility checks', () => {
  test('page declares a language attribute', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('all images have non-empty alt text', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i += 1) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image at index ${i} is missing alt text`).not.toBeNull();
    }
  });

  test('social icon links expose an accessible name', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    for (const link of Object.values(home.heroSocialLinks)) {
      const ariaLabel = await link.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('main navigation is reachable via keyboard focus', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.logo.focus();
    await page.keyboard.press('Tab');
    const activeTag = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON']).toContain(activeTag);
  });

  test('form inputs each have an associated label', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.scrollToSection('contact');

    const inputIds = ['nameInput', 'emailInput', 'subjectInput', 'messageInput'];
    for (const id of inputIds) {
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toHaveCount(1);
    }
  });
});
