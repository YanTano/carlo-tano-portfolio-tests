// utils/linkChecker.js
// Small helper for validating that an external link responds successfully,
// without needing Playwright to actually navigate away from the SPA.

/**
 * Issues a HEAD (falling back to GET) request via Playwright's APIRequestContext
 * and returns true if the response status is in the successful/redirect range.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} url
 */
async function isLinkReachable(request, url) {
  try {
    let response = await request.head(url, { maxRedirects: 5, timeout: 15000 });
    if (response.status() === 405 || response.status() === 501) {
      // Some servers don't support HEAD — retry with GET.
      response = await request.get(url, { maxRedirects: 5, timeout: 15000 });
    }
    return response.status() < 400;
  } catch (error) {
    return false;
  }
}

module.exports = { isLinkReachable };
