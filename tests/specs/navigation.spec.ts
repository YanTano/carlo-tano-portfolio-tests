import { test, expect } from '../fixtures/test-fixtures';

test.describe('Navigation', () => {
  test('desktop nav links scroll to the matching section', async ({ page, homePage }) => {
    const sections = ['about', 'projects', 'experience', 'skills', 'contact'];

    for (const id of sections) {
      await homePage.clickNavLink(id.charAt(0).toUpperCase() + id.slice(1));
      await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.2 });
    }
  });

  test('active nav link updates on scroll', async ({ page, homePage }) => {
    await homePage.scrollToSection('about');
    // give the scroll listener a tick to update .active
    await page.waitForTimeout(300);
    await expect(page.locator('[data-nav][href="#about"]')).toHaveClass(/active/);
  });

  test('resume link points to a real, downloadable PDF', async ({ homePage }) => {
    await expect(homePage.resumeLink).toHaveAttribute('href', /\.pdf$/);
    await expect(homePage.resumeLink).toHaveAttribute('download', '');
  });

  test('back-to-top button appears after scrolling and returns to top', async ({ page, homePage }) => {
    await expect(homePage.backToTopBtn).toHaveClass(/opacity-0/);

    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(300);
    await expect(homePage.backToTopBtn).not.toHaveClass(/opacity-0/);

    await homePage.backToTopBtn.click();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });

  test('footer year is the current year', async ({ homePage }) => {
    await expect(homePage.footerYear).toHaveText(String(new Date().getFullYear()));
  });
});

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile menu opens, links work, and closes after navigation', async ({ page, homePage }) => {
    await expect(homePage.mobileMenu).toBeHidden();

    await homePage.openMobileMenu();
    await expect(homePage.mobileMenu).toBeVisible();

    await homePage.mobileMenuLinks.filter({ hasText: 'Projects' }).click();
    await expect(homePage.mobileMenu).toBeHidden();
    await expect(page.locator('#projects')).toBeInViewport({ ratio: 0.1 });
  });
});
