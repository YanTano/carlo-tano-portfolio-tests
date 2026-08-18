import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the Carlo Tano portfolio site.
 * BASE_URL defaults to a local static server; override in CI or locally
 * to point at the deployed GitHub Pages / hosting URL instead.
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:5500';

export default defineConfig({
  testDir: './tests/specs',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // Uncomment to auto-serve the portfolio's static files during local runs:
  // webServer: {
  //   command: 'npx http-server ../carlo-tano-portfolio-main -p 5500',
  //   url: 'http://localhost:5500',
  //   reuseExistingServer: !process.env.CI,
  // },
});
