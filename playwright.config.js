// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

// Live site by default; override locally with BASE_URL=http://127.0.0.1:5500 etc.
const baseURL = process.env.BASE_URL || 'https://yantano.github.io/carlo-tano-portfolio/';

module.exports = defineConfig({
  testDir: './tests',
  // The site's Three.js particle scene can take a while to finish loading
  // on a cold request, so the overall per-test budget is a bit more
  // generous than Playwright's default.
  timeout: 45 * 1000,
  expect: {
    // The AI chat window's open/animate-in transition and first message
    // render can take a bit longer than the 5s default, especially under
    // multi-worker CPU contention — seen empirically on the ai-widget
    // suite. Auto-retrying assertions (toContainText, toHaveAttribute,
    // etc.) get this full budget before failing.
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Capped even locally — many parallel *headed* browser windows against a
  // remote live site can starve each other for CPU and cause action
  // timeouts that look like bugs but are actually just resource contention.
  // Override per-run with `npx playwright test --workers=N` if needed.
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 45 * 1000,
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
      // Excludes tests tagged @desktop-only (see navigation.spec.js) — those
      // interact with the desktop navbar, which the site's own CSS makes
      // display:none below the sm/md breakpoints. Running them against a
      // ~390-412px emulated device is a genuine test/project mismatch, not
      // something to paper over with test.skip(); this is the config-level
      // equivalent of "this test doesn't apply to this environment," which
      // still surfaces clearly in a project's test count if misconfigured
      // (unlike a skip buried inside a passing run).
      grepInvert: /@desktop-only/,
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
