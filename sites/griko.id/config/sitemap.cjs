// @ts-check

const meta = require("./meta.cjs");

/**
 * @type {import("next-sitemap").IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap/blob/master/packages/next-sitemap/src/interface.ts#L15
 */
const sitemapConfig = {
  changefreq: "daily",
  generateRobotsTxt: true,
  priority: 0.7,
  siteUrl: meta.url,
};

module.exports = sitemapConfig;
