// utils/linkChecker.js
// Small helper for validating that an external link responds successfully,
// without needing Playwright to actually navigate away from the SPA.

// Playwright's APIRequestContext sends a "Playwright/x.x" User-Agent by
// default, which some sites' bot/WAF protection (LinkedIn's in particular —
// confirmed via a real reproducible failure against
// https://www.linkedin.com/in/carlo-tano-7375bb1bb/, not a hypothetical)
// fingerprints as automation and blocks outright, independent of whether
// the link itself is valid. A real user clicking this link in an actual
// browser never hits that block. Sending a realistic desktop-browser UA is
// a correctness fix, not a weakened check: it makes the request represent
// what the test claims to verify ("does this link work for a user"),
// rather than "does this link work for an obviously-automated client."
const BROWSER_LIKE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * Issues a HEAD (falling back to GET) request via Playwright's APIRequestContext
 * and returns true if the response status is in the successful/redirect range.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} url
 */
async function isLinkReachable(request, url) {
  try {
    let response = await request.head(url, {
      maxRedirects: 5,
      timeout: 15000,
      headers: BROWSER_LIKE_HEADERS,
    });
    if (response.status() === 405 || response.status() === 501) {
      // Some servers don't support HEAD — retry with GET.
      response = await request.get(url, {
        maxRedirects: 5,
        timeout: 15000,
        headers: BROWSER_LIKE_HEADERS,
      });
    }
    return response.status() < 400;
  } catch (error) {
    return false;
  }
}

/**
 * Checks reachability by actually navigating a real browser page, rather
 * than a raw HTTP client. Confirmed necessary for linkedin.com: even with
 * realistic browser headers (see BROWSER_LIKE_HEADERS above), LinkedIn's
 * bot detection still blocked Playwright's APIRequestContext — it isn't a
 * real browser under the hood (no real TLS/JS fingerprint), and headers
 * alone can't fix that. A real page navigation is strictly more accurate
 * for "does this link work for an actual user," not a loosened check.
 * Opens a throwaway page in the same browser context and closes it after.
 * @param {import('@playwright/test').BrowserContext} context
 * @param {string} url
 */
async function isLinkReachableViaBrowser(context, url) {
  const probe = await context.newPage();
  try {
    const response = await probe.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    return !!response && response.status() < 400;
  } catch (error) {
    return false;
  } finally {
    await probe.close();
  }
}

module.exports = { isLinkReachable, isLinkReachableViaBrowser };

