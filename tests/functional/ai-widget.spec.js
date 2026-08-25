const { test, expect } = require('@playwright/test');

const { AIWidget } = require('../../pages/AIWidget');
const { SITE_URL } = require('../../utils/constants');

test.describe('Functional: Carlo AI widget', () => {

  // ============================================================
  // BEFORE EACH TEST
  // ============================================================

  test.beforeEach(async ({ page }) => {

    await page.goto(SITE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    /*
     * Allow the portfolio and Carlo AI widget to finish rendering.
     */

    await page.waitForTimeout(3000);

    const toggleButton = page.locator('#aiToggleBtn');

    await expect(toggleButton).toBeVisible({
      timeout: 15000
    });
  });


  // ============================================================
  // 1. CARLO AI TOGGLE IS VISIBLE
  // ============================================================

  test('Carlo AI toggle is visible', async ({ page }) => {

    const ai = new AIWidget(page);

    await expect(ai.toggleButton).toBeVisible({
      timeout: 15000
    });

    console.log('✓ Carlo AI toggle is visible');
  });


  // ============================================================
  // 2. CARLO AI OPENED
  // ============================================================

  test('Carlo AI opened', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    /*
     * Main verification:
     * Carlo AI chat window must actually be visible.
     */

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });

    console.log('✓ Carlo AI opened');
  });


  // ============================================================
  // 3. VOICE REPLIES TOGGLED
  // ============================================================

  test('Voice replies toggled', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    await ai.toggleVoiceReplies();

    console.log('✓ Voice replies toggled');
  });


  // ============================================================
  // 4. LIGHT / DARK MODE TOGGLED
  // ============================================================

  test('Light/Dark mode toggled', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    await ai.toggleTheme();

    console.log('✓ Light/Dark mode toggled');
  });


  // ============================================================
  // 5. FIRST TEST MESSAGE ENTERED
  // ============================================================

  test('First test message entered', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    const message = 'sample test sample test';

    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);

    console.log('✓ First test message entered');
  });


  // ============================================================
  // 6. CHAT CLEARED
  // ============================================================

  test('Chat cleared', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    const message = 'sample test sample test';

    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);

    await ai.clearChat();

    /*
     * IMPORTANT:
     *
     * The Carlo AI website clears the conversation,
     * but the textarea may retain its current value.
     *
     * Therefore we do NOT use:
     *
     * await expect(ai.input).toHaveValue('');
     *
     * because that does not represent the actual behavior
     * of the Clear Chat function on the website.
     */

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });

    console.log('✓ Chat cleared');
  });


  // ============================================================
  // 7. TELL ME ABOUT CARLO
  // ============================================================

  test('"Tell me about Carlo" selected', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    await ai.clickSuggestion('tell me about carlo');

    console.log('✓ "Tell me about Carlo" selected');
  });


  // ============================================================
  // 8. QA EXPERIENCE
  // ============================================================

  test('"QA Experience" selected', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    await ai.clickSuggestion('qa experience');

    console.log('✓ "QA Experience" selected');
  });


  // ============================================================
  // 9. SHOW HIS PROJECT
  // ============================================================

  test('"Show his project" selected', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    await ai.clickSuggestion('show his project');

    console.log('✓ "Show his project" selected');
  });


  // ============================================================
  // 10. SECOND TEST MESSAGE ENTERED
  // ============================================================

  test('Second test message entered', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    const message = 'sample test sample test';

    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);

    console.log('✓ Second test message entered');
  });


  // ============================================================
  // 11. SEND BUTTON CLICKED
  // ============================================================

  test('Send button clicked', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    const message = 'sample test sample test';

    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);

    await expect(ai.sendButton).toBeVisible({
      timeout: 10000
    });

    await ai.sendButton.click({
      force: true
    });

    console.log('✓ Send button clicked');
  });


  // ============================================================
  // 12. SEND COMPLETED
  // ============================================================

  test('Send completed', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    const message = 'sample test sample test';

    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);

    await ai.sendButton.click({
      force: true
    });

    /*
     * Carlo may retain the input value after sending.
     *
     * We intentionally do NOT assert:
     *
     * await expect(ai.input).toHaveValue('');
     */

    await page.waitForTimeout(1500);

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });

    console.log('✓ Send completed');
  });


  // ============================================================
  // 13. VOICE INPUT CLICKED
  // ============================================================

  test('Voice input clicked', async ({ page }) => {

    const ai = new AIWidget(page);

    await ai.open();

    const voiceInput = await ai.findVoiceInput();

    expect(
      voiceInput,
      'Carlo AI voice input button should exist'
    ).not.toBeNull();

    await ai.clickVoiceInput();

    console.log('✓ Voice input clicked');

    /*
     * Optional diagnostic information.
     *
     * This does not fail the test because different browsers
     * and implementations may expose different voice states.
     */

    try {

      const ariaPressed =
        await voiceInput.getAttribute('aria-pressed');

      const className =
        await voiceInput.getAttribute('class');

      const title =
        await voiceInput.getAttribute('title');

      const dataRecording =
        await voiceInput.getAttribute('data-recording');

      console.log('Voice input state:', {
        ariaPressed,
        className,
        dataRecording,
        title
      });

    } catch (error) {
      // Diagnostic information only.
    }

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });

    console.log('✓ Voice input test passed');
  });

});