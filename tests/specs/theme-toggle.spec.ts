import { test, expect } from '../fixtures/test-fixtures';

test.describe('Site-wide theme switch', () => {
  test('defaults to dark mode on first visit', async ({ page, homePage }) => {
    await expect(homePage.themeSwitchInput).toBeChecked();
    expect(await homePage.isDarkMode()).toBe(true);
    await expect(page.locator('body')).not.toHaveClass(/site-light-mode/);
    await expect(homePage.profilePhoto).toHaveAttribute('src', /carlo-dark\.jpeg$/);
  });

  test('switching to light mode updates background, photo, and persists on reload', async ({ page, homePage }) => {
    await homePage.toggleTheme();

    await expect(page.locator('body')).toHaveClass(/site-light-mode/);
    await expect(homePage.profilePhoto).toHaveAttribute('src', /carlo-light\.jpeg$/);
    await expect(homePage.themeSwitchInput).not.toBeChecked();

    // Reload and confirm the choice persisted via localStorage.
    await page.reload();
    await expect(page.locator('body')).toHaveClass(/site-light-mode/);
    await expect(homePage.themeSwitchInput).not.toBeChecked();
  });

  test('switching back to dark mode restores the original background and photo', async ({ page, homePage }) => {
    await homePage.toggleTheme(); // -> light
    await homePage.toggleTheme(); // -> dark

    await expect(page.locator('body')).not.toHaveClass(/site-light-mode/);
    await expect(homePage.profilePhoto).toHaveAttribute('src', /carlo-dark\.jpeg$/);
  });

  test('a fresh session with no saved preference always starts dark', async ({ browser }) => {
    const context = await browser.newContext(); // clean storage state
    const page = await context.newPage();
    await page.goto('/');

    await expect(page.locator('#input')).toBeChecked();
    await expect(page.locator('body')).not.toHaveClass(/site-light-mode/);

    await context.close();
  });
});
