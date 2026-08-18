import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the top-level layout: navbar, mobile menu,
 * theme switch, and hero section. Section-specific behavior
 * (contact form, AI widget) lives in their own page objects.
 */
export class HomePage {
  readonly page: Page;

  // Navbar
  readonly navbar: Locator;
  readonly navLinks: Locator;
  readonly resumeLink: Locator;
  readonly mobileMenuBtn: Locator;
  readonly mobileMenu: Locator;
  readonly mobileMenuLinks: Locator;

  // Theme switch
  readonly themeSwitchInput: Locator;
  readonly profilePhoto: Locator;

  // Hero
  readonly heroHeading: Locator;
  readonly heroTypedText: Locator;
  readonly hireMeBtn: Locator;
  readonly viewProjectsBtn: Locator;

  // Misc
  readonly backToTopBtn: Locator;
  readonly footerYear: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navbar = page.locator('#navbar');
    this.navLinks = page.locator('[data-nav]');
    this.resumeLink = page.locator('a[href*="Resume"]').first();
    this.mobileMenuBtn = page.locator('#mobileBtn');
    this.mobileMenu = page.locator('#mobileMenu');
    this.mobileMenuLinks = page.locator('[data-nav-mobile]');

    this.themeSwitchInput = page.locator('#input');
    this.profilePhoto = page.locator('#profilePhoto');

    this.heroHeading = page.locator('h1');
    this.heroTypedText = page.locator('#typed');
    this.hireMeBtn = page.locator('a[href="#contact"]', { hasText: 'Hire Me' });
    this.viewProjectsBtn = page.locator('a[href="#projects"]', { hasText: 'View Projects' });

    this.backToTopBtn = page.locator('#backToTop');
    this.footerYear = page.locator('#year');
  }

  async goto() {
    await this.page.goto('/');
    // Wait for the loader overlay to hide before interacting.
    await this.page.locator('#loader').waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  async openMobileMenu() {
    await this.mobileMenuBtn.click();
  }

  async isDarkMode(): Promise<boolean> {
    return !(await this.page.locator('body').evaluate((el) => el.classList.contains('site-light-mode')));
  }

  async toggleTheme() {
    await this.themeSwitchInput.click();
  }

  async clickNavLink(name: string) {
    await this.navLinks.filter({ hasText: name }).first().click();
  }

  async scrollToSection(id: string) {
    await this.page.locator(`#${id}`).scrollIntoViewIfNeeded();
  }
}
