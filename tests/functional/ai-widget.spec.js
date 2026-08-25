# Carlo Tano Portfolio — Playwright Tests

Playwright test automation for https://yantano.github.io/carlo-tano-portfolio/,
built with the Page Object Model. **This version is set up to run locally
with Node.js — no GitHub Actions/CI yet.** Add that later once you're happy
with local runs.

## 1. Install

```bash
npm install
npx playwright install --with-deps
```

`npx playwright install --with-deps` downloads the actual browser engines
(Chromium/Firefox/WebKit) Playwright drives — separate from any browser
already on your machine. On Windows/Mac this runs without extra permissions;
on Linux it may ask for `sudo`.

## 2. Run the tests

```bash
# Everything
npx playwright test

# One suite at a time
npm run test:smoke
npm run test:functional
npm run test:regression
npm run test:negative

# Watch it happen in a real browser window
npx playwright test --headed

# Best for learning/debugging — step through each action
npx playwright test --ui
```

Tests run against the **live site** by default
(`https://yantano.github.io/carlo-tano-portfolio/`). No local server needed.

## 3. View results

```bash
npx playwright show-report
```

Opens an HTML report: pass/fail per test, duration, and (on failures)
screenshots/video/trace.

## Project structure

```
├── tests/
│   ├── smoke/          # Is the site up at all
│   ├── functional/     # Feature behavior (nav, contact form, AI widget, dynamic sections)
│   ├── negative/       # Invalid input handling
│   └── regression/     # Responsive layout, external links, basic accessibility
├── pages/               # Page Object Model — one file per page/section
├── test-data/           # Reusable JSON test data
├── utils/                # Small shared helpers
└── playwright.config.js
```

See [`TEST_CASES.md`](./TEST_CASES.md) for the full test case inventory.

## Next step: CI (once local runs are solid)

When you're ready to automate this on every push, add a
`.github/workflows/playwright.yml` that runs `npm ci`,
`npx playwright install --with-deps`, then `npx playwright test`. Ask me for
that file when you get there — better to get local runs 100% green first.
