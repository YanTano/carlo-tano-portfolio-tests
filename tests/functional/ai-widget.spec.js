const { test, expect } = require('@playwright/test');

const { AIWidget } = require('../../pages/AIWidget');
const { SITE_URL } = require('../../utils/constants');

test.describe('Functional: Carlo AI widget', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await expect(page.locator('#aiToggleBtn')).toBeVisible({
      timeout: 15000
    });
  });

  test('Carlo AI toggle is visible', async ({ page }) => {
    const ai = new AIWidget(page);

    await expect(ai.toggleButton).toBeVisible();
  });

  test('Carlo AI opens successfully', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });
  });

  test('Voice replies can be toggled', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();

    await ai.toggleVoiceReplies();

    await expect(ai.chatWindow).toBeVisible();
  });

  test('Light/Dark mode can be toggled', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();

    await ai.toggleTheme();

    await expect(ai.chatWindow).toBeVisible();
  });

  test('User can enter a message', async ({ page }) => {
    const ai = new AIWidget(page);
    const message = 'sample test sample test';

    await ai.open();
    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);
  });

  test('User can clear the chat', async ({ page }) => {
    const ai = new AIWidget(page);
    const message = 'sample test sample test';

    await ai.open();
    await ai.enterMessage(message);
    await expect(ai.input).toHaveValue(message);

    await ai.clearChat();

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });
  });

  test('"Tell me about Carlo" suggestion is selectable', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();
    await ai.clickSuggestion('tell me about carlo');

    await expect(ai.chatWindow).toBeVisible();
  });

  test('"QA Experience" suggestion is selectable', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();
    await ai.clickSuggestion('qa experience');

    await expect(ai.chatWindow).toBeVisible();
  });

  test('"Show his project" suggestion is selectable', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();
    await ai.clickSuggestion('show his project');

    await expect(ai.chatWindow).toBeVisible();
  });

  test('User can enter a second message', async ({ page }) => {
    const ai = new AIWidget(page);
    const message = 'sample test sample test';

    await ai.open();
    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);
  });

  test('User can click Send', async ({ page }) => {
    const ai = new AIWidget(page);
    const message = 'sample test sample test';

    await ai.open();
    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);
    await expect(ai.sendButton).toBeVisible();

    await ai.sendButton.click();

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });
  });

  test('Voice input is available', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();

    const voiceInput = await ai.findVoiceInput();

    expect(
      voiceInput,
      'Carlo AI voice input button should exist'
    ).not.toBeNull();

    await ai.clickVoiceInput();

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });
  });

});const { test, expect } = require('@playwright/test');

const { AIWidget } = require('../../pages/AIWidget');
const { SITE_URL } = require('../../utils/constants');

test.describe('Functional: Carlo AI widget', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await expect(page.locator('#aiToggleBtn')).toBeVisible({
      timeout: 15000
    });
  });

  test('Carlo AI toggle is visible', async ({ page }) => {
    const ai = new AIWidget(page);

    await expect(ai.toggleButton).toBeVisible();
  });

  test('Carlo AI opens successfully', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });
  });

  test('Voice replies can be toggled', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();

    await ai.toggleVoiceReplies();

    await expect(ai.chatWindow).toBeVisible();
  });

  test('Light/Dark mode can be toggled', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();

    await ai.toggleTheme();

    await expect(ai.chatWindow).toBeVisible();
  });

  test('User can enter a message', async ({ page }) => {
    const ai = new AIWidget(page);
    const message = 'sample test sample test';

    await ai.open();
    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);
  });

  test('User can clear the chat', async ({ page }) => {
    const ai = new AIWidget(page);
    const message = 'sample test sample test';

    await ai.open();
    await ai.enterMessage(message);
    await expect(ai.input).toHaveValue(message);

    await ai.clearChat();

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });
  });

  test('"Tell me about Carlo" suggestion is selectable', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();
    await ai.clickSuggestion('tell me about carlo');

    await expect(ai.chatWindow).toBeVisible();
  });

  test('"QA Experience" suggestion is selectable', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();
    await ai.clickSuggestion('qa experience');

    await expect(ai.chatWindow).toBeVisible();
  });

  test('"Show his project" suggestion is selectable', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();
    await ai.clickSuggestion('show his project');

    await expect(ai.chatWindow).toBeVisible();
  });

  test('User can enter a second message', async ({ page }) => {
    const ai = new AIWidget(page);
    const message = 'sample test sample test';

    await ai.open();
    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);
  });

  test('User can click Send', async ({ page }) => {
    const ai = new AIWidget(page);
    const message = 'sample test sample test';

    await ai.open();
    await ai.enterMessage(message);

    await expect(ai.input).toHaveValue(message);
    await expect(ai.sendButton).toBeVisible();

    await ai.sendButton.click();

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });
  });

  test('Voice input is available', async ({ page }) => {
    const ai = new AIWidget(page);

    await ai.open();

    const voiceInput = await ai.findVoiceInput();

    expect(
      voiceInput,
      'Carlo AI voice input button should exist'
    ).not.toBeNull();

    await ai.clickVoiceInput();

    await expect(ai.chatWindow).toBeVisible({
      timeout: 10000
    });
  });

});
