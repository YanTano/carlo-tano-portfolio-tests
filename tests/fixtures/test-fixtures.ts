import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactSection } from '../pages/ContactSection';
import { AiWidget } from '../pages/AiWidget';

type Fixtures = {
  homePage: HomePage;
  contactSection: ContactSection;
  aiWidget: AiWidget;
};

/**
 * Extends the base Playwright test with ready-to-use page objects,
 * and navigates to the home page before every test so specs stay
 * focused on behavior instead of setup boilerplate.
 */
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
  contactSection: async ({ page }, use) => {
    await use(new ContactSection(page));
  },
  aiWidget: async ({ page }, use) => {
    await use(new AiWidget(page));
  },
});

export { expect } from '@playwright/test';
