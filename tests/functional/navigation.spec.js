// tests/functional/navigation.spec.js
// Verifies the in-page anchor navigation (desktop + mobile) and hero CTAs.

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const testData = require('../../test-data/testData.json');

// Tagged @desktop-only: every test in this block clicks/reads elements
// from the desktop navbar (header#navbar .hidden.md:flex, and the resume
// link's .hidden.sm:inline-flex) — confirmed via the real site CSS these
// are display:none below their breakpoints, so they're excluded from the
// accessibility tree entirely on a narrow viewport. Running this block
// against a mobile-emulated project (e.g. Pixel 7 at ~390-412px) is a
// genuine test/project mismatch, not a site bug — see playwright.config.js
// where the mobile-chrome project excludes @desktop-only via grepInvert.
// ("Functional: mobile navigation" below is the correct coverage for
// narrow viewports and runs everywhere, including mobile-chrome.)
test.describe('Functional: navigation', { tag: '@desktop-only' }, () => {
  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
  });

  for (const item of testData.site.expectedNavItems) {
    test(`desktop nav link "${item}" scrolls to its section`, async ({ page }) => {
      const home = new HomePage(page);
      await home.clickDesktopNavLink(item);
      // URL hash should update to match the target anchor.
      await expect(page).toHaveURL(new RegExp(`#${item.toLowerCase()}$`));
    });
  }

  test('"Hire Me" button scrolls to the contact section', async ({ page }) => {
    const home = new HomePage(page);
    await home.hireMeButton.click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('"View Projects" button scrolls to the projects section', async ({ page }) => {
    const home = new HomePage(page);
    await home.viewProjectsButton.click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#projects')).toBeVisible();
  });

  test('resume download link points to the resume PDF', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.resumeButton).toBeVisible();
    await expect(home.resumeButton).toHaveAttribute(
      'href',
      /assets\/documents\/.*Resume\.pdf/
    );
    await expect(home.resumeButton).toHaveAttribute('download', '');
  });

  test('social icon links open the correct external destinations', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.heroSocialLinks.github).toHaveAttribute(
      'href',
      testData.site.socialLinks.github
    );
    await expect(home.heroSocialLinks.linkedin).toHaveAttribute(
      'href',
      testData.site.socialLinks.linkedin
    );
    await expect(home.heroSocialLinks.facebook).toHaveAttribute(
      'href',
      testData.site.socialLinks.facebook
    );
    await expect(home.heroSocialLinks.email).toHaveAttribute(
      'href',
      testData.site.socialLinks.email
    );

    // mailto: links correctly don't carry target="_blank"/rel="noopener" —
    // those attributes are only meaningful for links that open a web page
    // in a new tab. Only check them on the actual web-profile links.
    const { email, ...webLinks } = home.heroSocialLinks;
    for (const link of Object.values(webLinks)) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
    await expect(home.heroSocialLinks.email).toHaveAttribute('href', /^mailto:/);
  });

  test('back-to-top button appears after scrolling and returns to the hero', async ({ page }) => {
    const home = new HomePage(page);

    // The button only toggles opacity-0/pointer-events-none (see
    // js/navbar.js, threshold: window.scrollY > 600) — it's never
    // display:none, so Playwright's toBeVisible() alone can't tell
    // "faded out" from "faded in" (opacity doesn't affect that check).
    // Assert the actual computed opacity to genuinely verify the
    // fade behavior instead of a check that would pass either way.
    await expect(home.backToTopButton).toHaveCSS('opacity', '0');

    await home.scrollToFooter();
    await expect(home.backToTopButton).toHaveCSS('opacity', '1');
    await expect(home.backToTopButton).toBeVisible();

    await home.clickBackToTop();
    await expect(home.heroSection).toBeInViewport();
  });
});

test.describe('Functional: mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger button opens the mobile menu with all nav links', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.mobileMenuButton).toBeVisible();
    await expect(home.mobileMenu).toBeHidden();

    await home.openMobileMenu();
    await expect(home.mobileMenu).toBeVisible();
    await expect(home.mobileNavLinks).toHaveCount(testData.site.expectedNavItems.length);
  });

  test('tapping a mobile nav link scrolls to the target section', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.openMobileMenu();

    await home.clickMobileNavLink('Skills');
    await expect(page).toHaveURL(/#skills$/);
  });
});
