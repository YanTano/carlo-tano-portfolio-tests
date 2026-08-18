import { test, expect, request } from '@playwright/test';

test.describe('Project cards', () => {
  test('renders at least one project card with title, tags, and both links', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#projectsGrid > div');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);

    const firstCard = cards.first();
    await expect(firstCard.locator('h3')).not.toBeEmpty();
    await expect(firstCard.getByText('Live Demo')).toBeVisible();
    await expect(firstCard.getByText('GitHub')).toBeVisible();
  });

  test('every outbound project link opens safely in a new tab', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('#projectsGrid a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('every "Live Demo" and "GitHub" URL resolves without a 4xx/5xx', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('#projectsGrid a').evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).href)
    );

    const api = await request.newContext();
    for (const href of hrefs) {
      const response = await api.get(href, { failOnStatusCode: false });
      expect(response.status(), `${href} should resolve successfully`).toBeLessThan(400);
    }
    await api.dispose();
  });

  test('project screenshots load without broken images', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('#projectsGrid img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth, 'image should have loaded with non-zero width').toBeGreaterThan(0);
    }
  });
});
