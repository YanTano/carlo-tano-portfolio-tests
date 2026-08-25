# Carlo Tano Portfolio — Playwright Tests

[![Playwright Tests](https://github.com/YanTano/carlo-tano-portfolio-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/YanTano/carlo-tano-portfolio-tests/actions/workflows/playwright.yml)

Playwright test automation for https://yantano.github.io/carlo-tano-portfolio/,
built with the Page Object Model, running locally **and** in GitHub Actions CI.

## Project structure

```
├── .github/workflows/
│   └── playwright.yml   # CI pipeline (push / PR / manual trigger)
├── tests/
│   ├── smoke/            # Is the site up at all
│   ├── functional/       # Feature behavior (nav, contact form, AI widget, dynamic sections)
│   ├── negative/         # Invalid input handling
│   └── regression/       # Responsive layout, external links, basic accessibility
├── pages/                 # Page Object Model — one file per page/section
├── test-data/             # Reusable JSON test data
├── utils/                  # Small shared helpers
└── playwright.config.js
```

See [`TEST_CASES.md`](./TEST_CASES.md) for the full test case inventory.

## 1. Install dependencies

```bash
npm ci
npx playwright install --with-deps
```

Use `npm ci`, not `npm install` — it installs exactly what's pinned in
`package-lock.json`, which is what keeps local runs and CI reproducible.
`npx playwright install --with-deps` downloads the actual browser engines
(Chromium/Firefox/WebKit) Playwright drives — separate from any browser
already on your machine. On Windows/Mac this runs without extra permissions;
on Linux it may ask for `sudo`.

## 2. Run Playwright locally

```bash
# Everything, all four projects (chromium, firefox, webkit, mobile-chrome)
npx playwright test

# Watch it happen in a real browser window
npx playwright test --headed

# Best for learning/debugging — step through each action
npx playwright test --ui
```

Tests run against the **live site** by default
(`https://yantano.github.io/carlo-tano-portfolio/`). No local server needed.
Override it for a different environment with:

```bash
BASE_URL=http://127.0.0.1:5500 npx playwright test
```

`BASE_URL` is read in `playwright.config.js` (`process.env.BASE_URL || 'https://yantano.github.io/carlo-tano-portfolio/'`),
so it works the same way locally and in CI — set the env var, nothing else changes.

### Run individual projects or suites

```bash
# One browser project at a time
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=mobile-chrome   # npm run test:mobile

# One suite at a time
npm run test:smoke
npm run test:functional
npm run test:regression
npm run test:negative
```

> `mobile-chrome` runs against a Pixel 7 emulated viewport and automatically
> excludes tests tagged `@desktop-only` (see `navigation.spec.js`) — those
> assert against the desktop navbar, which the site's own CSS hides below
> the sm/md breakpoints, via `grepInvert` in `playwright.config.js`.

## 3. View results

```bash
npx playwright show-report
```

Opens an HTML report: pass/fail per test, duration, and (on failures)
screenshots/video/trace. In CI, the same report is published as a downloadable
workflow artifact — see below.

## CI/CD architecture

Every push to `main`, every pull request targeting `main`, any manual run
from the **Actions** tab, and a daily 06:00 UTC schedule (catches
regressions on the live site even with no code changes) trigger
`.github/workflows/playwright.yml`, which runs on a single `ubuntu-latest`
job:

1. **Checkout** the repository (`actions/checkout@v6`).
2. **Set up Node.js 20** with npm's dependency cache enabled (`actions/setup-node@v6`)
   — satisfies this project's `"engines": { "node": ">=20" }` requirement.
3. **`npm ci`** — clean, lockfile-exact install.
4. **`npx playwright install --with-deps`** — installs Chromium, Firefox,
   and WebKit plus the Ubuntu system libraries they need.
5. **`npx playwright test`** — runs the full suite across all four
   projects, with `BASE_URL` pointed at the live GitHub Pages site.
6. **Upload artifacts** — the HTML report always, and `test-results/`
   (screenshots, videos, traces) whenever a failure produced any.

The job fails (and blocks the PR / marks the push red) the moment any
Playwright test fails — no extra configuration needed, `playwright test`
already exits non‑zero on failure and GitHub Actions treats a non‑zero step
as a failed job.

`playwright.config.js` itself is CI-aware and unmodified by this pipeline:
`process.env.CI` (set automatically by GitHub Actions) already tightens
`forbidOnly`, bumps `retries` to `2`, and caps `workers` at `2` to avoid the
resource contention that was seen empirically running many parallel headed
browsers against a remote site.

## Browser coverage

| Project        | Engine            | Notes                                             |
|-----------------|-------------------|----------------------------------------------------|
| `chromium`      | Desktop Chrome    | Full desktop suite                                 |
| `firefox`       | Desktop Firefox   | Full desktop suite                                 |
| `webkit`        | Desktop Safari    | Full desktop suite                                 |
| `mobile-chrome` | Pixel 7 (Chromium)| Excludes `@desktop-only` tagged tests               |

All four run in the same CI job, matching local `npx playwright test`.

## GitHub Actions workflow

```
.github/
└── workflows/
    └── playwright.yml
```

Triggers: `push` to `main`, `pull_request` targeting `main`, manual
`workflow_dispatch`, and a daily `schedule` (06:00 UTC). See the file itself
for the full step-by-step pipeline described above.

## Test reporting

- **Real-time status:** the badge at the top of this README reflects the
  live state of the most recent run — queued/running/pass/fail — pulled
  directly from GitHub Actions, no manual refresh needed. Click it (or the
  **Actions** tab) to watch a run in progress step-by-step.
- **Local:** `npx playwright show-report` opens the HTML report generated
  under `playwright-report/`.
- **CI:** the same `playwright-report/` folder is uploaded as the
  `playwright-report` workflow artifact on every run (pass or fail),
  downloadable from the run's **Summary** page for 14 days.
- **On failure:** `test-results/` (screenshots, videos, and traces — per
  the `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, and
  `trace: 'on-first-retry'` settings in `playwright.config.js`) is uploaded
  as a separate `test-results` artifact for the same 14 days.
