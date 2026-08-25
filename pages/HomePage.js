// pages/HomePage.js
// Covers the navbar, hero, about, skills, projects, experience, services,
// testimonials and footer regions of the single-page portfolio.

const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // ---- Navbar ----
    this.logo = page.locator('header#navbar a.font-display');
    this.desktopNavLinks = page.locator('header#navbar [data-nav]');
    // Scoped to the navbar specifically — the site has a second "Resume"
    // link inside #mobileMenu (see mobileResumeButton below). An
    // unscoped getByRole('link', {name:/resume/i}) matches both and is a
    // latent Playwright strict-mode violation waiting to happen; it only
    // "worked" before by accident of which one happened to be hidden
    // (display:none) at a given viewport/menu-state.
    this.resumeButton = page.locator('header#navbar').getByRole('link', { name: /resume/i });
    this.mobileMenuButton = page.locator('#mobileBtn');
    this.mobileMenu = page.locator('#mobileMenu');
    this.mobileNavLinks = page.locator('#mobileMenu [data-nav-mobile]');
    this.mobileResumeButton = page.locator('#mobileMenu').getByRole('link', { name: /resume/i });
    // Visibility-independent — both the desktop and mobile resume links
    // point to the identical PDF, and this is only ever used to *read*
    // the href, not to click it. A plain attribute selector queries the
    // DOM directly rather than the accessibility tree, so it resolves
    // correctly regardless of which nav variant is currently
    // display:none at the active viewport (unlike getByRole, which
    // excludes display:none elements from the accessibility tree).
    this.anyResumeLink = page.locator('a[href*="Resume.pdf"]').first();

    // ---- Hero ----
    this.heroSection = page.locator('#home');
    this.heroHeading = page.locator('#home h1');
    this.typedText = page.locator('#typed');
    this.hireMeButton = page.getByRole('link', { name: /hire me/i });
    this.viewProjectsButton = page.getByRole('link', { name: /view projects/i });
    this.heroSocialLinks = {
      github: page.locator('#home a[aria-label="GitHub"]'),
      linkedin: page.locator('#home a[aria-label="LinkedIn"]'),
      facebook: page.locator('#home a[aria-label="Facebook"]'),
      email: page.locator('#home a[aria-label="Email"]'),
    };
    this.heroPortrait = page.locator('#portraitCard img');

    // ---- About ----
    this.aboutSection = page.locator('#about');
    this.aboutStatCards = page.locator('#about [data-count]');

    // ---- Skills / Projects / Experience / Services (JS-injected) ----
    this.skillsSection = page.locator('#skills');
    this.skillsGrid = page.locator('#skillsGrid');
    this.skillsItems = page.locator('#skillsGrid > *');

    this.projectsSection = page.locator('#projects');
    this.projectsGrid = page.locator('#projectsGrid');
    this.projectCards = page.locator('#projectsGrid > *');

    this.experienceSection = page.locator('#experience');
    this.timelineItems = page.locator('#timelineItems > *');

    this.servicesSection = page.locator('#services');
    this.servicesGrid = page.locator('#servicesGrid');
    this.serviceCards = page.locator('#servicesGrid > *');

    this.testimonialsSection = page.locator('#testimonials');
    this.testimonialTrack = page.locator('#testimonialTrack');
    this.testimonialDots = page.locator('#testimonialDots > *');

    // ---- Footer ----
    this.footer = page.locator('footer');
    this.footerYear = page.locator('footer #year');
    this.footerSocialLinks = {
      github: page.locator('footer a[aria-label="GitHub"]'),
      linkedin: page.locator('footer a[aria-label="LinkedIn"]'),
      facebook: page.locator('footer a[aria-label="Facebook"]'),
      email: page.locator('footer a[aria-label="Email"]'),
    };
    this.backToTopButton = page.locator('#backToTop');
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
  }

  async clickDesktopNavLink(name) {
    await this.page.locator(`header#navbar [data-nav]:has-text("${name}")`).click();
  }

  async clickMobileNavLink(name) {
    await this.page.locator(`#mobileMenu [data-nav-mobile]:has-text("${name}")`).click();
  }

  async scrollToFooter() {
    await this.footer.scrollIntoViewIfNeeded();
  }

  async clickBackToTop() {
    await this.backToTopButton.click();
  }
}

module.exports = { HomePage };
