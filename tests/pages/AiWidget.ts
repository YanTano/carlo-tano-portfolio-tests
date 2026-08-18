import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the "Carlo AI" chat widget.
 * Note: this widget has its own theme toggle (#aiThemeBtn) that is
 * scoped only to #aiWidget via data-ai-theme, independent from the
 * site-wide light/dark switch (#input). Keep the two suites separate.
 */
export class AiWidget {
  readonly page: Page;
  readonly widget: Locator;
  readonly toggleBtn: Locator;
  readonly chatWindow: Locator;
  readonly closeBtn: Locator;
  readonly clearBtn: Locator;
  readonly themeBtn: Locator;
  readonly voiceOutBtn: Locator;
  readonly micBtn: Locator;
  readonly input: Locator;
  readonly sendBtn: Locator;
  readonly messages: Locator;
  readonly badge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.widget = page.locator('#aiWidget');
    this.toggleBtn = page.locator('#aiToggleBtn');
    this.chatWindow = page.locator('#aiChatWindow');
    this.closeBtn = page.locator('#aiCloseBtn');
    this.clearBtn = page.locator('#aiClearBtn');
    this.themeBtn = page.locator('#aiThemeBtn');
    this.voiceOutBtn = page.locator('#aiVoiceOutBtn');
    this.micBtn = page.locator('#aiMicBtn');
    this.input = page.locator('#aiInput');
    this.sendBtn = page.locator('#aiSendBtn');
    this.messages = page.locator('#aiMessages');
    this.badge = page.locator('#aiBadge');
  }

  async open() {
    await this.toggleBtn.click();
  }

  async close() {
    await this.closeBtn.click();
  }

  async isOpen(): Promise<boolean> {
    return (await this.toggleBtn.getAttribute('aria-expanded')) === 'true';
  }

  async sendMessage(text: string) {
    await this.input.fill(text);
    await this.sendBtn.click();
  }

  async widgetTheme(): Promise<string | null> {
    return this.widget.getAttribute('data-ai-theme');
  }
}
