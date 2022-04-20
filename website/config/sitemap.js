// @ts-check

const metadataJson = require("./metadata.json");

/** @type {import("next-sitemap").IConfig} */
const sitemapConfig = {
  changefreq: "daily",
  generateRobotsTxt: true,
  priority: 0.7,
  siteUrl: metadataJson.url,
};

module.exports = sitemapConfig;
