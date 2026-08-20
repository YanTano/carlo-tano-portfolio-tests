# Carlo Tano Portfolio — QA Automation Framework

## Overview

A professional Playwright test automation framework for the Carlo Tano
portfolio website. It covers smoke, functional, negative, regression,
navigation, form-validation, responsive, and basic-accessibility testing
using the Page Object Model.

## Application Under Test

- **Live URL:** https://yantano.github.io/carlo-tano-portfolio/
- **Source Repository:** https://github.com/YanTano/carlo-tano-portfolio

The site under test is a single-page, static HTML/Tailwind/Three.js
portfolio (no backend of its own), hosted on GitHub Pages. This
automation project is intentionally kept **separate** from the
application source — it does not modify or depend on the site's repo.

## Testing Framework

- [Playwright Test](https://playwright.dev/) (JavaScript)
- Node.js
- GitHub Actions (CI/CD)
- Page Object Model (POM)
- JSON test data

## Test Coverage

| Area | Covered |
|---|---|
| Smoke (site up, title, hero, navbar, sections, footer) | ✅ |
| Navigation (desktop + mobile, anchors, CTAs, resume, socials) | ✅ |
| Contact form — functional (valid data, EmailJS request stubbed) | ✅ |
| Contact form — negative (empty/invalid fields, native HTML5 validation) | ✅ |
| Dynamically-rendered sections (skills/projects/experience/services/testimonials) | ✅ |
| "Carlo AI" chat widget (open/close, chips, send — UI only) | ✅ |
| Responsive layout (mobile/tablet/desktop) | ✅ |
| External link validation (social links, resume PDF) | ✅ |
| Basic accessibility (lang attribute, alt text, labels, keyboard focus) | ✅ |
| AI-generated reply content | ❌ Out of scope — see `TEST_CASES.md` |
| Visual regression / pixel diffing | ❌ Not included |

See [`TEST_CASES.md`](./TEST_CASES.md) for the full test case inventory
(IDs, steps, priority, automation status).

## Project Structure

```
carlo-tano-portfolio-tests/
├── tests/
│   ├── smoke/               # Fast "is the site up" checks
│   │   └── smoke.spec.js
│   ├── functional/          # Feature-level positive coverage
│   │   ├── navigation.spec.js
│   │   ├── contact-form.spec.js
│   │   ├── ai-widget.spec.js
│   │   └── dynamic-sections.spec.js
│   ├── negative/            # Invalid-input / error-path coverage
│   │   └── contact-form-negative.spec.js
│   └── regression/          # Cross-cutting: responsive, links, a11y
│       └── regression.spec.js
├── pages/                   # Page Object Model
│   ├── BasePage.js
│   ├── HomePage.js
│   ├── ContactPage.js
│   └── AIWidget.js
├── test-data/
│   └── testData.json        # Reusable, non-secret test data
├── utils/
│   └── linkChecker.js       # External link reachability helper
├── playwright.config.js
├── package.json
├── TEST_CASES.md            # Test case inventory / QA documentation
├── README.md
└── .github/workflows/playwright.yml
```

## Installation

```bash
npm install
npx playwright install --with-deps
```

## Run Tests

```bash
# Run the full suite (all browsers)
npx playwright test

# Run one suite
npm run test:smoke
npm run test:functional
npm run test:regression
npm run test:negative

# Run in a headed browser (see it happen)
npx playwright test --headed

# Interactive UI mode (best for local debugging)
npx playwright test --ui

# Run against a specific browser project
npx playwright test --project=chromium
npx playwright test --project=mobile-chrome
```

By default, tests run against the live site
(`https://yantano.github.io/carlo-tano-portfolio/`). To point at a local
copy instead:

```bash
BASE_URL=http://127.0.0.1:5500 npx playwright test
```

## Reports

After a run, open the HTML report:

```bash
npx playwright show-report
```

The report includes pass/fail status, duration, browser project,
screenshots on failure, and trace files for first-retry failures.

## Running Locally in VS Code

1. Install the [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension.
2. Open this folder in VS Code.
3. Run `npm install && npx playwright install --with-deps` in the integrated terminal.
4. Use the Testing sidebar (flask icon) to run/debug individual tests, or run `npx playwright test --ui`.

## CI/CD — GitHub Actions

`.github/workflows/playwright.yml` runs on every push and pull request to
`main` (and can be triggered manually via `workflow_dispatch`). It:

1. Checks out the repo and installs Node.js 20.
2. Installs dependencies (`npm ci`) and Playwright browsers.
3. Runs the full test suite against the live GitHub Pages URL.
4. Uploads the HTML report and trace/screenshot/video artifacts, even on
   failure, so results are downloadable from the workflow run.

## Test Results

_Use this section to log notable test runs over time._

| Date | Trigger | Result | Notes |
|------|---------|--------|-------|
| — | — | — | — |

## Limitations

See the "Known Limitations / Not Automated" section at the bottom of
[`TEST_CASES.md`](./TEST_CASES.md) for what is intentionally out of scope
and why (AI reply content, real email delivery, the space-cat mascot,
visual regression, and full WCAG auditing).
