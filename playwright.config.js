// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

// Live site by default; override locally with BASE_URL=http://127.0.0.1:5500 etc.
const baseURL = process.env.BASE_URL || 'https://yantano.github.io/carlo-tano-portfolio/';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
  // This project tests a static GitHub Pages site (no local server needed).
  // Uncomment below only if you serve the repo locally instead:
  // webServer: {
  //   command: 'npx http-server ../carlo-tano-portfolio -p 5500',
  //   url: 'http://127.0.0.1:5500',
  //   reuseExistingServer: !process.env.CI,
  // },
});
