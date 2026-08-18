import { test, expect } from '../fixtures/test-fixtures';

test.describe('Carlo AI chat widget', () => {
  test('opens and closes via the toggle button', async ({ aiWidget }) => {
    await expect(aiWidget.chatWindow).toBeHidden();

    await aiWidget.open();
    await expect(aiWidget.chatWindow).toBeVisible();
    expect(await aiWidget.isOpen()).toBe(true);

    await aiWidget.close();
    await expect(aiWidget.chatWindow).toBeHidden();
  });

  test('widget theme toggle is scoped to the widget only, independent of the site theme', async ({
    homePage,
    aiWidget,
  }) => {
    await aiWidget.open();
    expect(await aiWidget.widgetTheme()).toBe('dark');

    await aiWidget.themeBtn.click();
    expect(await aiWidget.widgetTheme()).toBe('light');

    // Toggling the AI widget's theme must NOT affect the site-wide theme.
    expect(await homePage.isDarkMode()).toBe(true);
  });

  test('clear chat empties the message history', async ({ aiWidget }) => {
    await aiWidget.open();
    await aiWidget.sendMessage('What projects have you worked on?');
    await expect(aiWidget.messages).not.toBeEmpty();

    await aiWidget.clearBtn.click();
    await expect(aiWidget.messages).toBeEmpty();
  });

  test('clicking away from the chat window closes it on desktop', async ({ page, aiWidget }) => {
    await aiWidget.open();
    await page.mouse.click(20, 20);
    await expect(aiWidget.chatWindow).toBeHidden();
  });
});
