// pages/AIWidget.js
// Covers the "Carlo AI" floating chat widget.
// NOTE: the widget's assistant replies come from a backend/service this
// framework does not control, so tests built on this object only assert
// on client-side, deterministic behavior (open/close, chip -> input,
// user message rendering) and never assert on specific AI reply content.

const { BasePage } = require('./BasePage');

class AIWidget extends BasePage {
  constructor(page) {
    super(page);

    this.root = page.locator('#aiWidget');
    this.toggleButton = page.locator('#aiToggleBtn');
    this.chatWindow = page.locator('#aiChatWindow');
    this.messagesLog = page.locator('#aiMessages');
    this.suggestedChips = page.locator('#aiSuggested .ai-chip');
    this.input = page.locator('#aiInput');
    this.sendButton = page.locator('#aiSendBtn');
    this.micButton = page.locator('#aiMicBtn');
    this.voiceOutButton = page.locator('#aiVoiceOutBtn');
    this.themeButton = page.locator('#aiThemeBtn');
    this.clearButton = page.locator('#aiClearBtn');
    this.closeButton = page.locator('#aiCloseBtn');
  }

  async open() {
    await this.toggleButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async isOpen() {
    const expanded = await this.toggleButton.getAttribute('aria-expanded');
    return expanded === 'true';
  }

  async clickSuggestedChip(question) {
    await this.page.locator(`#aiSuggested .ai-chip[data-q="${question}"]`).click();
  }

  async sendMessage(text) {
    await this.input.fill(text);
    await this.sendButton.click();
  }
}

module.exports = { AIWidget };
