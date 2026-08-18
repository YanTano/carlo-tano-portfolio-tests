import { Page, Locator } from '@playwright/test';

export class ContactSection {
  readonly page: Page;
  readonly section: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitBtn: Locator;
  readonly formNote: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('#contact');
    this.form = page.locator('#contactForm');
    this.nameInput = page.locator('#nameInput');
    this.emailInput = page.locator('#emailInput');
    this.subjectInput = page.locator('#subjectInput');
    this.messageInput = page.locator('#messageInput');
    this.submitBtn = this.form.locator('button[type="submit"]');
    this.formNote = page.locator('#formNote');
  }

  async fill(data: { name: string; email: string; subject: string; message: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageInput.fill(data.message);
  }

  async submit() {
    await this.submitBtn.click();
  }
}
