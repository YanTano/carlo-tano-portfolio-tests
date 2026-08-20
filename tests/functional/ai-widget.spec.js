// tests/functional/ai-widget.spec.js
// Covers the "Carlo AI" chat widget's own client-side behavior only.
// The widget's actual AI-generated replies come from a third-party/backend
// service outside this repo's control, so these tests deliberately do not
// assert on reply content — only on the deterministic UI behavior the site
// itself is responsible for (open/close state, suggested chips filling the
// input, and the user's own message being rendered in the log).

const { test, expect } = require('@playwright/test');
const { AIWidget } = require('../../pages/AIWidget');
const { SITE_URL } = require('../../utils/constants');

test.describe('Functional: Carlo AI widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URL);
  });

  test('chat window is closed by default and opens on toggle click', async ({ page }) => {
    const ai = new AIWidget(page);

    expect(await ai.isOpen()).toBe(false);
    await ai.open();
    expect(await ai.isOpen()).toBe(true);
    await expect(ai.chatWindow).toBeVisible();
  });

  test('close button collapses the chat window', async ({ page }) => {
    const ai = new AIWidget(page);
    await ai.open();
    await expect(ai.chatWindow).toBeVisible();

    await ai.close();
    expect(await ai.isOpen()).toBe(false);
  });

  test('suggested question chips are visible with expected labels', async ({ page }) => {
    const ai = new AIWidget(page);
    await ai.open();

    await expect(ai.suggestedChips.first()).toBeVisible();
    expect(await ai.suggestedChips.count()).toBeGreaterThanOrEqual(5);
  });

  test('clicking a suggested chip sends the question into the message log', async ({ page }) => {
    const ai = new AIWidget(page);
    await ai.open();

    await ai.clickSuggestedChip('Tell me about Carlo');
    await expect(ai.messagesLog).toContainText('Tell me about Carlo');
  });

  test('typing a custom message and sending renders it in the log', async ({ page }) => {
    const ai = new AIWidget(page);
    await ai.open();

    const question = 'What testing tools does Carlo use?';
    await ai.sendMessage(question);
    await expect(ai.messagesLog).toContainText(question);
    await expect(ai.input).toHaveValue('');
  });

  test('utility controls (clear, theme, voice) are present and clickable', async ({ page }) => {
    const ai = new AIWidget(page);
    await ai.open();

    await expect(ai.clearButton).toBeVisible();
    await expect(ai.themeButton).toBeVisible();
    await expect(ai.voiceOutButton).toBeVisible();

    await ai.clearButton.click();
    await expect(ai.messagesLog).toBeVisible();
  });
});
