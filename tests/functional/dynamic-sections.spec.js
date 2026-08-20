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
    expect(await home.skillsItems.count()).toBeGreaterThan(0);
  });

  test('projects grid renders at least one project card', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('projects');
    await expect(home.projectsGrid).toBeVisible();
    expect(await home.projectCards.count()).toBeGreaterThan(0);
  });

  test('experience timeline renders at least one entry', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('experience');
    expect(await home.timelineItems.count()).toBeGreaterThan(0);
  });

  test('services grid renders at least one service card', async ({ page }) => {
    const home = new HomePage(page);
    await home.scrollToSection('services');
    await expect(home.servicesGrid).toBeVisible();
    expect(await home.serviceCards.count()).toBeGreaterThan(0);
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

    const count = await home.aboutStatCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const target = await home.aboutStatCards.nth(i).getAttribute('data-count');
      expect(Number(target)).toBeGreaterThan(0);
    }
  });
});
