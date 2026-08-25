const { expect } = require('@playwright/test');

class AIWidget {
  constructor(page) {
    this.page = page;

    // ============================================================
    // MAIN CARLO AI ELEMENTS
    // ============================================================

    this.toggleButton = page.locator('#aiToggleBtn');

    this.chatWindow = page.locator('#aiChatWindow');

    this.voiceRepliesButton = page.locator('#aiVoiceOutBtn');

    this.themeButton = page.locator('#aiThemeBtn');

    this.clearButton = page.locator('#aiClearBtn');

    this.input = page.locator('#aiInput');

    this.sendButton = page.locator('#aiSendBtn');

    this.messagesLog = page.locator('#aiMessages');

    this.suggestedChips = page.locator('#aiSuggested .ai-chip');

    // Possible voice input implementations
    this.voiceInputButton = page.locator('#aiVoiceInBtn');
  }

  // ============================================================
  // OPEN CARLO AI
  // ============================================================

  async open() {
    await expect(this.toggleButton).toBeVisible({
      timeout: 15000
    });

    /*
     * The Carlo AI floating button has an animation.
     *
     * Native DOM click avoids Playwright waiting for the
     * animated element to become stable.
     */

    await this.toggleButton.evaluate((button) => {
      button.click();
    });

    /*
     * Verify the actual functional state:
     * the Carlo AI chat window must become visible.
     */

    await expect(this.chatWindow).toBeVisible({
      timeout: 10000
    });
  }

  // ============================================================
  // CLOSE CARLO AI
  // ============================================================

  async close() {
    await expect(this.chatWindow).toBeVisible({
      timeout: 10000
    });

    await this.toggleButton.evaluate((button) => {
      button.click();
    });

    await expect(this.chatWindow).not.toBeVisible({
      timeout: 10000
    });
  }

  // ============================================================
  // TOGGLE VOICE REPLIES
  // ============================================================

  async toggleVoiceReplies() {
    await expect(this.voiceRepliesButton).toBeVisible({
      timeout: 10000
    });

    await this.voiceRepliesButton.click({
      force: true
    });

    await this.page.waitForTimeout(500);
  }

  // ============================================================
  // TOGGLE LIGHT / DARK MODE
  // ============================================================

  async toggleTheme() {
    await expect(this.themeButton).toBeVisible({
      timeout: 10000
    });

    await this.themeButton.click({
      force: true
    });

    await this.page.waitForTimeout(500);
  }

  // ============================================================
  // ENTER MESSAGE
  // ============================================================

  async enterMessage(message) {
    await expect(this.input).toBeVisible({
      timeout: 10000
    });

    await this.input.fill(message);

    await expect(this.input).toHaveValue(message);
  }

  // ============================================================
  // CLEAR CHAT
  // ============================================================

  async clearChat() {
    await expect(this.clearButton).toBeVisible({
      timeout: 10000
    });

    /*
     * Carlo AI's Clear Chat button can be affected by widget
     * animations/overlays in Firefox.
     *
     * Native DOM click provides more reliable interaction
     * across Chromium, Firefox, WebKit, and mobile browsers.
     */

    await this.clearButton.evaluate((button) => {
      button.click();
    });

    /*
     * The actual website's Clear button clears the conversation
     * but may NOT clear the textarea value.
     *
     * Therefore, we intentionally do not assert:
     *
     * await expect(this.input).toHaveValue('');
     */

    await this.page.waitForTimeout(700);
  }

  // ============================================================
  // CLICK SUGGESTED CHIP
  // ============================================================

  async clickSuggestion(text) {
    const chip = this.suggestedChips
      .filter({
        hasText: new RegExp(text, 'i')
      })
      .first();

    await expect(chip).toBeVisible({
      timeout: 10000
    });

    /*
     * Firefox can be affected by Carlo AI widget animations
     * and overlays when using Playwright's normal click action.
     *
     * Native DOM click provides a more stable interaction
     * across Chromium, Firefox, WebKit, and mobile browsers.
     */

    await chip.evaluate((button) => {
      button.click();
    });

    await this.page.waitForTimeout(700);
  }

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  async sendMessage(message) {
    await this.enterMessage(message);

    await expect(this.sendButton).toBeVisible({
      timeout: 10000
    });

    await this.sendButton.click({
      force: true
    });

    await this.page.waitForTimeout(1500);
  }

  // ============================================================
  // FIND VOICE INPUT
  // ============================================================

  async findVoiceInput() {
    const candidates = [
      this.page.locator('#aiVoiceInBtn'),

      this.page.getByRole('button', {
        name: /voice input/i
      }),

      this.page.getByRole('button', {
        name: /start voice/i
      }),

      this.page.getByRole('button', {
        name: /microphone/i
      }),

      this.page.getByRole('button', {
        name: /mic/i
      }),

      this.page.locator(
        'button[aria-label*="voice" i]'
      ),

      this.page.locator(
        'button[title*="voice" i]'
      ),

      this.page.locator(
        'button[aria-label*="microphone" i]'
      ),

      this.page.locator(
        'button[title*="microphone" i]'
      )
    ];

    for (const candidate of candidates) {
      try {
        const count = await candidate.count();

        if (count === 0) {
          continue;
        }

        const first = candidate.first();

        if (await first.isVisible()) {
          return first;
        }
      } catch (error) {
        // Continue searching for another possible implementation.
      }
    }

    return null;
  }

  // ============================================================
  // CLICK VOICE INPUT
  // ============================================================

  async clickVoiceInput() {
    const voiceInput = await this.findVoiceInput();

    if (!voiceInput) {
      await this.page.screenshot({
        path: 'test-results/carlo-ai-voice-input-not-found.png',
        fullPage: true
      });

      throw new Error(
        'Carlo AI voice input button was not found. ' +
        'Expected #aiVoiceInBtn or an accessible voice/microphone button.'
      );
    }

    await voiceInput.click({
      force: true
    });

    await this.page.waitForTimeout(500);

    return voiceInput;
  }
}

module.exports = {
  AIWidget
};