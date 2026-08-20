// pages/BasePage.js
// Shared behavior for every page/section object in the framework.

const { SITE_URL } = require('../utils/constants');

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to the full site URL by default. Pass an absolute URL to
   * override. Deliberately does NOT accept a bare '/' — against a
   * baseURL with a subpath (GitHub Pages), '/' resolves to the site
   * root and silently drops the subpath.
   */
  async goto(url = SITE_URL) {
    await this.page.goto(url);
  }

  async title() {
    return this.page.title();
  }

  /** Scrolls a section into view by its in-page anchor id (no leading #). */
  async scrollToSection(anchorId) {
    await this.page.locator(`#${anchorId}`).scrollIntoViewIfNeeded();
  }

  /** True if the element currently in the viewport / rendered. */
  async isVisible(locator) {
    return locator.isVisible();
  }
}

module.exports = { BasePage };
