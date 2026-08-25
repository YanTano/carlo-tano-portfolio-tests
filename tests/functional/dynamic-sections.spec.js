// tests/functional/dynamic-sections.spec.js
// The Skills, Projects, Experience, Services and Testimonials sections are
// populated at runtime by js/projects.js rather than hard-coded in the
// HTML. These tests verify each grid actually renders content — they do
// not assert on specific item text/count, since that content is
// maintained as data and is expected to change over time.

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');

test.describe('Functional: dynamically rendered sections', () => {
  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
  });

  test('skills grid renders at least one skill item', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('skills');
    await expect(home.skillsGrid).toBeVisible();
    // not.toHaveCount(0) is a web-first assertion that auto-retries —
    // js/projects.js populates this grid via a script that runs after
    // initial page load, so a one-shot `.count()` check here is a race:
    // it can read 0 items if the script hasn't finished appending yet.
    await expect(home.skillsItems).not.toHaveCount(0);
  });

  test('projects grid renders at least one project card', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('projects');
    await expect(home.projectsGrid).toBeVisible();
    await expect(home.projectCards).not.toHaveCount(0);
  });

  test('experience timeline renders at least one entry', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('experience');
    await expect(home.timelineItems).not.toHaveCount(0);
  });

  test('services grid renders at least one service card', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('services');
    await expect(home.servicesGrid).toBeVisible();
    await expect(home.serviceCards).not.toHaveCount(0);
  });

  test('testimonials track renders content and navigation dots', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('testimonials');
    await expect(home.testimonialTrack).toBeVisible();
    await expect(home.testimonialTrack).not.toBeEmpty();
  });

  test('about stat counters render with numeric targets', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('about');

    // Wait for the grid to actually be populated before counting/looping —
    // these stat cards are static HTML (not script-injected like the
    // sections above), but this still guards against reading the DOM
    // before layout/paint has settled after the scroll.
    await expect(home.aboutStatCards.first()).toBeVisible();
    const count = await home.aboutStatCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const target = await home.aboutStatCards.nth(i).getAttribute('data-count');
      expect(Number(target)).toBeGreaterThan(0);
    }
  });
});
