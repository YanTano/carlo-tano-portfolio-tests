import { test, expect } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page has no critical or serious WCAG violations', async ({ page, homePage }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const blocking = results.violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? ''));

    if (blocking.length) {
      console.log(JSON.stringify(blocking, null, 2));
    }
    expect(blocking, 'no critical/serious accessibility violations').toHaveLength(0);
  });

  test('every project image has meaningful alt text', async ({ page, homePage }) => {
    const images = page.locator('#projectsGrid img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, 'image should not be missing alt text').toBeTruthy();
      expect(alt!.length).toBeGreaterThan(3);
    }
  });

  test('the whole nav is keyboard-reachable via Tab', async ({ page, homePage }) => {
    await page.keyboard.press('Tab'); // skip loader/first focusable
    const firstNavLink = homePage.navLinks.first();
    await firstNavLink.focus();
    await expect(firstNavLink).toBeFocused();
  });

  test('theme switch has an accessible name', async ({ homePage }) => {
    const label = homePage.themeSwitchInput.locator('xpath=ancestor::label');
    await expect(label).toBeVisible();
  });
});
