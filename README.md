# Carlo Tano Portfolio — Playwright Test Suite

[![Playwright Tests](https://github.com/YanTano/carlo-tano-portfolio-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/YanTano/carlo-tano-portfolio-tests/actions/workflows/playwright.yml)

End-to-end automated test framework for [yantano.github.io/carlo-tano-portfolio](https://yantano.github.io/carlo-tano-portfolio/)
(my portfolio site), written in TypeScript with [Playwright](https://playwright.dev). Built as a
real, runnable example of how I structure an automation framework: Page Object Model, fixtures,
cross-browser and cross-viewport coverage, and CI on every push.

## Why test your own portfolio?

It's a real target I have full permission and context to test — running automation against
sites you don't own can violate their terms of service or the law, even when well-intentioned.
Testing a live site I control also means every spec here maps to a real user flow: theme
switching, the contact form, the AI chat widget, outbound project links, and responsive layout.

## Stack

| Layer | Tool |
|---|---|
| Test runner | Playwright Test |
| Language | TypeScript |
| Pattern | Page Object Model + custom fixtures |
| Accessibility | axe-core |
| CI | GitHub Actions (push, PR, nightly cron) |
| Browsers | Chromium, Firefox, WebKit, + mobile Chrome/Safari emulation |

## Project structure

```
playwright-portfolio-tests/
├── tests/
│   ├── pages/                  # Page Object Model
│   │   ├── HomePage.ts         # navbar, theme switch, hero, back-to-top
│   │   ├── ContactSection.ts   # contact form
│   │   └── AiWidget.ts         # Carlo AI chat widget
│   ├── fixtures/
│   │   └── test-fixtures.ts    # wires page objects into `test`
│   └── specs/
│       ├── navigation.spec.ts
│       ├── theme-toggle.spec.ts
│       ├── contact-form.spec.ts
│       ├── ai-widget.spec.ts
│       ├── project-links.spec.ts
│       ├── responsive.spec.ts
│       └── accessibility.spec.ts
├── .github/workflows/playwright.yml
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Design decisions

- **Page Object Model** — locators and interactions live in `tests/pages/`, specs only
  describe behavior. Changing a selector means editing one file, not every spec that uses it.
- **Fixtures over `beforeEach` boilerplate** — `homePage`, `contactSection`, and `aiWidget`
  are injected automatically and already navigated/ready, so specs start at the interesting part.
- **Network stubbing for the contact form** — `page.route()` intercepts the EmailJS call so the
  suite is deterministic and doesn't send real emails on every CI run, while a separate live-link
  check (`project-links.spec.ts`) still hits real URLs to catch actual broken links.
- **Independent theme systems get independent specs** — the site has two separate theme
  toggles (site-wide sky/dark switch vs. the AI widget's own scoped toggle). One spec explicitly
  asserts they don't leak into each other, since that's an easy regression to introduce.
- **Multi-browser + multi-viewport by default** — `playwright.config.ts` runs every spec across
  5 browser/device projects out of the box.

## Running locally

```bash
npm install
npx playwright install --with-deps

# Point at the live site (default) or override for local dev:
BASE_URL=http://localhost:5500 npm test

npm run test:ui       # interactive UI mode
npm run test:headed   # watch it run in a real browser
npm run report        # open the last HTML report
```

## CI

`.github/workflows/playwright.yml` runs the full suite on every push/PR to `main`, plus a
nightly scheduled run against the live URL to catch drift (e.g. an expired outbound link)
even when no code has changed. The HTML report is uploaded as a build artifact on every run.

## Coverage summary

- Navigation: section scrolling, active-link state, mobile menu, back-to-top, resume download link
- Theme switch: dark-by-default, persistence across reload, background/photo swap, fresh-session default
- Contact form: required-field and email-format validation, success/error states
- AI chat widget: open/close, scoped theme toggle, clear chat, click-away-to-close
- Project cards: link integrity (target/rel), live HTTP status checks, image load checks
- Responsive: 4 breakpoints, no horizontal overflow, no console errors, correct nav pattern
- Accessibility: axe-core WCAG2 A/AA scan, alt text, keyboard reachability
