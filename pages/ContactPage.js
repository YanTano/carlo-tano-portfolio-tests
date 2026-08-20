// pages/ContactPage.js
// Covers the #contact section: the EmailJS-powered contact form.

const { BasePage } = require('./BasePage');
const { SITE_URL } = require('../utils/constants');

class ContactPage extends BasePage {
  constructor(page) {
    super(page);

    this.section = page.locator('#contact');
    this.form = page.locator('#contactForm');
    this.nameInput = page.locator('#nameInput');
    this.emailInput = page.locator('#emailInput');
    this.subjectInput = page.locator('#subjectInput');
    this.messageInput = page.locator('#messageInput');
    this.submitButton = page.locator('#contactForm button[type="submit"]');
    this.formNote = page.locator('#formNote');
    this.contactEmailText = page.locator('#contact').getByText('tano.carlom@gmail.com');
  }

  async goto() {
    await this.page.goto(SITE_URL);
    await this.section.scrollIntoViewIfNeeded();
  }

  async fillForm({ name, email, subject, message }) {
    if (name !== undefined) await this.nameInput.fill(name);
    if (email !== undefined) await this.emailInput.fill(email);
    if (subject !== undefined) await this.subjectInput.fill(subject);
    if (message !== undefined) await this.messageInput.fill(message);
  }

  async submit() {
    await this.submitButton.click();
  }

  /** Native HTML5 validity of a given input (no assumptions about custom JS). */
  async isFieldValid(locator) {
    return locator.evaluate((el) => el.checkValidity());
  }

  async formValidationMessage(locator) {
    return locator.evaluate((el) => el.validationMessage);
  }
}

module.exports = { ContactPage };
