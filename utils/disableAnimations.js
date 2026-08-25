// utils/disableAnimations.js
// The site uses decorative animations that never settle — some via CSS
// (transitions/keyframes) and, notably, some via GSAP, which animates by
// writing inline styles directly on every requestAnimationFrame tick
// rather than through CSS. CSS-only fixes (animation-play-state,
// transition: none) have no effect on GSAP-driven motion, which is why
// the AI chat toggle button (a GSAP-powered pulse) kept failing
// Playwright's click-stability check even after freezing CSS animations.
//
// This freezes both: CSS animations/transitions via an injected
// stylesheet, and GSAP's global timeline via its own pause API (if GSAP
// is present on the page as `window.gsap`, which it is here since it's
// loaded via a CDN <script> tag as a global).
//
// This does NOT bypass Playwright's other actionability checks
// (visibility, being unobstructed) — an element genuinely covered by
// another element will still correctly fail to be clicked.

async function disableAnimations(page) {
  await page
    .addStyleTag({
      content: `
        *, *::before, *::after {
          animation-play-state: paused !important;
          transition: none !important;
        }
      `,
    })
    .catch(() => {
      // Non-fatal — proceeds without CSS freezing if this couldn't attach.
    });

  await page
    .evaluate(() => {
      // @ts-ignore — gsap is a page global loaded via <script> tag, not a module import.
      if (typeof window.gsap !== 'undefined' && window.gsap.globalTimeline) {
        // @ts-ignore
        window.gsap.globalTimeline.pause();
      }
    })
    .catch(() => {
      // Non-fatal — GSAP may not have loaded yet or may not be present;
      // the CSS freeze above still applies regardless.
    });
}

module.exports = { disableAnimations };

