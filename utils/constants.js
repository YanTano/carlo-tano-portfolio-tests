// utils/constants.js
// Single source of truth for the full site URL (including the GitHub
// Pages subpath). Every page object and test navigates via this constant
// instead of a relative '/' — a leading slash resolves against the
// baseURL's *origin*, not its path, which would silently drop
// "/carlo-tano-portfolio/" and load the wrong page.

const SITE_URL = 'https://yantano.github.io/carlo-tano-portfolio/';

module.exports = { SITE_URL };
