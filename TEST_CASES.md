# Test Case Inventory — Carlo Tano Portfolio

Application Under Test: https://yantano.github.io/carlo-tano-portfolio/
Source: https://github.com/YanTano/carlo-tano-portfolio

Legend — Priority: High / Medium / Low · Status: Automated / Manual / Not Automated

## Smoke (`tests/smoke/smoke.spec.js`)

| ID | Scenario | Preconditions | Test Steps | Expected Result | Priority | Automation Status |
|----|----------|----------------|------------|------------------|----------|--------------------|
| TC-001 | Homepage loads successfully | None | Navigate to base URL | HTTP response status < 400 | High | Automated |
| TC-002 | Page title is correct | None | Load homepage | Title contains "Carlo Tano" | High | Automated |
| TC-003 | Hero section renders | Homepage loaded | Inspect hero region | Heading, "Hire Me" and "View Projects" buttons visible | High | Automated |
| TC-004 | Navbar renders all links | Homepage loaded | Inspect navbar | Home/About/Projects/Experience/Skills/Contact all present | High | Automated |
| TC-005 | All main sections exist in DOM | Homepage loaded | Query each section id | Each of home/about/skills/projects/experience/services/testimonials/contact exists | High | Automated |
| TC-006 | Footer renders with social links | Homepage loaded | Scroll to footer | Footer visible with GitHub/LinkedIn/Facebook/Email links | Medium | Automated |

## Functional — Navigation (`tests/functional/navigation.spec.js`)

| ID | Scenario | Preconditions | Test Steps | Expected Result | Priority | Automation Status |
|----|----------|----------------|------------|------------------|----------|--------------------|
| TC-010 | Desktop nav links scroll to section | Homepage loaded, desktop viewport | Click each nav link | URL hash updates to matching anchor | High | Automated |
| TC-011 | "Hire Me" CTA navigates to contact | Homepage loaded | Click "Hire Me" | URL hash = #contact, section visible | High | Automated |
| TC-012 | "View Projects" CTA navigates to projects | Homepage loaded | Click "View Projects" | URL hash = #projects, section visible | High | Automated |
| TC-013 | Resume link points to a real PDF with download attribute | Homepage loaded | Inspect resume link | href matches resume PDF path; `download` attribute present | Medium | Automated |
| TC-014 | Social icons link to correct external profiles | Homepage loaded | Inspect hero social icons | href/target/rel correct for GitHub, LinkedIn, Facebook, Email | Medium | Automated |
| TC-015 | Back-to-top button appears and returns to hero | Scrolled to footer | Click back-to-top button | Hero section back in viewport | Low | Automated |
| TC-016 | Mobile hamburger opens nav menu | Mobile viewport | Tap hamburger icon | Mobile menu becomes visible with all nav links | High | Automated |
| TC-017 | Mobile nav link scrolls to section | Mobile menu open | Tap a mobile nav link | URL hash updates to matching anchor | High | Automated |

## Functional — Contact Form (`tests/functional/contact-form.spec.js`)

| ID | Scenario | Preconditions | Test Steps | Expected Result | Priority | Automation Status |
|----|----------|----------------|------------|------------------|----------|--------------------|
| TC-020 | Contact form fields render | Homepage loaded | Scroll to contact | Name, Email, Subject, Message, Submit all visible | High | Automated |
| TC-021 | Form accepts valid data | Contact form visible | Fill all fields with valid data | Inputs hold values; native validity passes | High | Automated |
| TC-022 | Valid submission triggers EmailJS request | Contact form filled validly | Click submit | Network request to EmailJS API observed | High | Automated |
| TC-023 | Contact section shows correct email | Homepage loaded | Scroll to contact | tano.carlom@gmail.com visible | Low | Automated |

## Negative (`tests/negative/contact-form-negative.spec.js`)

| ID | Scenario | Preconditions | Test Steps | Expected Result | Priority | Automation Status |
|----|----------|----------------|------------|------------------|----------|--------------------|
| TC-030 | Empty form submission is blocked | Contact form empty | Click submit | Required-field validity fails; no network call fires | High | Automated |
| TC-031 | Blank name is rejected | Other fields valid | Submit with empty name | Name field fails native validation | Medium | Automated |
| TC-032 | Blank message is rejected | Other fields valid | Submit with empty message | Message field fails native validation | Medium | Automated |
| TC-033 | Malformed email is rejected | Other fields valid | Submit with invalid email string | Email field fails native validation with a message | High | Automated |
| TC-034 | Well-formed email passes validation | — | Fill email field with valid address | Field passes native validity check | Medium | Automated |

## Functional — Dynamic Sections (`tests/functional/dynamic-sections.spec.js`)

| ID | Scenario | Preconditions | Test Steps | Expected Result | Priority | Automation Status |
|----|----------|----------------|------------|------------------|----------|--------------------|
| TC-040 | Skills grid renders items | Homepage loaded | Scroll to skills | At least one skill item rendered | Medium | Automated |
| TC-041 | Projects grid renders cards | Homepage loaded | Scroll to projects | At least one project card rendered | High | Automated |
| TC-042 | Experience timeline renders entries | Homepage loaded | Scroll to experience | At least one timeline entry rendered | Medium | Automated |
| TC-043 | Services grid renders cards | Homepage loaded | Scroll to services | At least one service card rendered | Low | Automated |
| TC-044 | Testimonials track renders content | Homepage loaded | Scroll to testimonials | Track is visible and non-empty | Low | Automated |
| TC-045 | About stat counters have numeric targets | Homepage loaded | Scroll to about | Each stat card has a positive `data-count` | Low | Automated |

## Functional — Carlo AI Widget (`tests/functional/ai-widget.spec.js`)

| ID | Scenario | Preconditions | Test Steps | Expected Result | Priority | Automation Status |
|----|----------|----------------|------------|------------------|----------|--------------------|
| TC-050 | Chat window closed by default, opens on toggle | Homepage loaded | Click AI toggle button | `aria-expanded` becomes true; window visible | Medium | Automated |
| TC-051 | Close button collapses chat window | Chat window open | Click close button | Window collapses | Medium | Automated |
| TC-052 | Suggested chips render | Chat window open | Inspect chip list | ≥ 5 suggested-question chips visible | Low | Automated |
| TC-053 | Clicking a chip sends the question | Chat window open | Click a suggested chip | Question text appears in message log | Medium | Automated |
| TC-054 | Typing and sending a custom message | Chat window open | Type message, click send | Message appears in log; input clears | Medium | Automated |
| TC-055 | Utility controls are present | Chat window open | Inspect header icons | Clear/Theme/Voice buttons visible and clickable | Low | Automated |
| — | AI-generated reply content/accuracy | — | — | Out of scope — backend/service-dependent, non-deterministic | — | Not Automated |

## Regression (`tests/regression/regression.spec.js`)

| ID | Scenario | Preconditions | Test Steps | Expected Result | Priority | Automation Status |
|----|----------|----------------|------------|------------------|----------|--------------------|
| TC-060 | Desktop layout shows full nav, hides hamburger | Desktop viewport | Load homepage | Desktop nav visible, hamburger hidden | High | Automated |
| TC-061 | Mobile layout hides full nav, shows hamburger | Mobile viewport | Load homepage | Hamburger visible, desktop nav hidden | High | Automated |
| TC-062 | Tablet layout has no horizontal overflow | Tablet viewport | Load homepage | scrollWidth ≤ clientWidth (+1px tolerance) | Medium | Automated |
| TC-063 | Hero portrait loads on all breakpoints | Mobile/Tablet/Desktop | Load homepage per viewport | Image visible with naturalWidth > 0 | Medium | Automated |
| TC-064 | Social/resume external links are reachable | Homepage loaded | HEAD/GET each external link | All return status < 400 | Medium | Automated |
| TC-065 | Resume PDF resolves with correct content-type | Homepage loaded | GET resume URL | Status < 400, content-type contains "pdf" | Medium | Automated |
| TC-066 | Page declares a language attribute | Homepage loaded | Inspect `<html lang>` | Non-empty lang attribute | Low | Automated |
| TC-067 | All images have alt text | Homepage loaded | Inspect every `<img>` | Every image has a non-null alt attribute | Medium | Automated |
| TC-068 | Social icons have accessible names | Homepage loaded | Inspect social links | Each has a non-empty aria-label | Medium | Automated |
| TC-069 | Navbar is keyboard-reachable | Homepage loaded | Tab from logo | Focus lands on a link or button | Medium | Automated |
| TC-070 | Contact inputs have associated labels | Contact section loaded | Inspect each input | A matching `<label for="...">` exists | Medium | Automated |

## Known Limitations / Not Automated

- **AI reply content** — the Carlo AI widget's actual generated answers depend on a backend/model outside this repository's control and are non-deterministic; only the deterministic client-side UI behavior is automated.
- **Real email delivery** — the contact form's EmailJS network call is intercepted and stubbed in CI to avoid sending real emails and to avoid depending on EmailJS account credentials/quota. A separate, manually-run "live" check is recommended before major releases if real delivery needs verification.
- **Space cat mascot drag/jump/sound** — a decorative Easter egg with no defined pass/fail business behavior; not covered by automated assertions.
- **Cross-browser visual regression** (pixel-level screenshot diffing) — not included; this framework focuses on functional and structural QA rather than visual regression testing.
- **WCAG-level accessibility audit** — only basic, high-value checks (lang attribute, image alt text, labels, keyboard reachability) are automated. A full audit would need a dedicated tool such as axe-core.
