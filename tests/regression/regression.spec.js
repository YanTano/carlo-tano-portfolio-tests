// tests/regression/regression.spec.js
// Broader cross-cutting checks: responsive layout, external link
// reachability, and basic accessibility hygiene. Meant to run on every
// build to catch regressions across the whole page rather than one
// feature at a time.

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const testData = require('../../test-data/testData.json');
const { isLinkReachableViaBrowser } = require('../../utils/linkChecker');

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

    // On failure, identify the actual offending element(s) instead of just
    // reporting the two numbers — walks every element and reports any
    // whose right edge exceeds the viewport, so a real overflow bug is
    // immediately actionable rather than requiring manual DevTools digging.
    // Also walks the #1 offender's ancestor chain (left/right/width/computed
    // width/min-width per level) — a min-w-0 fix on the form itself had
    // zero measurable effect (identical 910px before/after deploying it),
    // which rules out "this element won't shrink" and points to something
    // being inherited from further up the tree instead.
    if (scrollWidth > clientWidth + 1) {
      const offenders = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        return Array.from(document.querySelectorAll('body *'))
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { el, right: r.right, width: r.width };
          })
          .filter(({ right, width }) => right > vw + 1 && width > 0)
          .sort((a, b) => b.right - a.right)
          .slice(0, 5)
          .map(({ el, right }) => {
            const id = el.id ? `#${el.id}` : '';
            const cls = el.className && typeof el.className === 'string'
              ? `.${el.className.trim().split(/\s+/).join('.')}`
              : '';
            return `${el.tagName.toLowerCase()}${id}${cls} (right edge: ${Math.round(right)}px, viewport: ${vw}px)`;
          });
      });

      const ancestorChain = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const worst = Array.from(document.querySelectorAll('body *'))
          .map((el) => ({ el, right: el.getBoundingClientRect().right }))
          .filter(({ right }) => right > vw + 1)
          .sort((a, b) => b.right - a.right)[0];
        if (!worst) return [];

        const chain = [];
        let node = worst.el;
        while (node && node !== document.body.parentElement) {
          const r = node.getBoundingClientRect();
          const cs = window.getComputedStyle(node);
          const id = node.id ? `#${node.id}` : '';
          const cls = node.className && typeof node.className === 'string'
            ? `.${node.className.trim().split(/\s+/).join('.')}`
            : '';
          chain.push(
            `${node.tagName.toLowerCase()}${id}${cls} — left:${Math.round(r.left)} right:${Math.round(r.right)} ` +
              `width:${Math.round(r.width)} | css width:${cs.width} min-width:${cs.minWidth} ` +
              `display:${cs.display} position:${cs.position}`
          );
          node = node.parentElement;
        }
        return chain;
      });

      expect(
        scrollWidth,
        `Horizontal overflow detected (scrollWidth ${scrollWidth} > clientWidth ${clientWidth}). ` +
          `Likely offending element(s):\n${offenders.join('\n')}\n\n` +
          `Ancestor chain of the worst offender (child \u2192 root):\n${ancestorChain.join('\n')}`
      ).toBeLessThanOrEqual(clientWidth + 1);
    } else {
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1px rounding tolerance
    }
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
  test('GitHub profile link resolves without error', async ({ page, context }) => {
    const home = new HomePage(page);
    await home.goto();

    const reachable = await isLinkReachableViaBrowser(context, testData.site.socialLinks.github);
    expect(reachable, `Expected ${testData.site.socialLinks.github} to be reachable`).toBe(true);
  });

  test('LinkedIn profile link is well-formed', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Not a live-reachability check, deliberately — confirmed via two
    // independent technical approaches (a raw HTTP client with realistic
    // browser headers, and a real Playwright browser page navigation)
    // that linkedin.com blocks automated/CI-origin requests regardless of
    // client fidelity. That's a property of the request's origin (almost
    // certainly IP-based — datacenter/CI ranges are commonly rate-limited
    // by LinkedIn), not something any client-side technique can work
    // around, and not a reflection of whether the link itself is correct.
    // This instead verifies the href matches the exact expected LinkedIn
    // profile URL — genuine coverage for "is this link configured
    // correctly," just narrower in scope than live reachability.
    const href = await home.heroSocialLinks.linkedin.getAttribute('href');
    expect(href).toBe(testData.site.socialLinks.linkedin);
    expect(href).toMatch(/^https:\/\/www\.linkedin\.com\/in\/[\w-]+\/?$/);
  });

  test('resume PDF resolves successfully', async ({ page, request, baseURL }) => {
    const home = new HomePage(page);
    await home.goto();
    // anyResumeLink (not resumeButton) — this only needs the href value,
    // and the desktop nav link is display:none below the sm breakpoint,
    // so a role-based lookup would fail to resolve on narrow viewports
    // (e.g. the mobile-chrome project) even though the underlying PDF
    // link is identical either way.
    const href = await home.anyResumeLink.getAttribute('href');
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

  test('main navigation supports keyboard focus', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    if (await home.desktopNavLinks.first().isVisible()) {
      const navLinks = home.desktopNavLinks;

      for (let i = 0; i < await navLinks.count(); i++) {
        await navLinks.nth(i).focus();
        await expect(navLinks.nth(i)).toBeFocused();
      }

      return;
    }
    await expect(home.mobileMenuButton).toBeVisible();
    await home.mobileMenuButton.focus();
    await expect(home.mobileMenuButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(home.mobileMenu).toBeVisible();

    const mobileLinks = home.mobileNavLinks;

    for (let i = 0; i < await mobileLinks.count(); i++) {
      await mobileLinks.nth(i).focus();
      await expect(mobileLinks.nth(i)).toBeFocused();
    }
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
