const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { publicDir, resolveCwd } = require("./utils");

const buildSitemap = async ({ blogPosts, siteConfig }) => {
  const smStream = new SitemapStream({
    hostname: siteConfig.url,
  });

  const routes = [
    "/",
    "/about",
    "/appearances",
    "/blog",
    "/projects",
    ...blogPosts.map(({ slug }) => `/blog/${slug}`),
  ];

  for (const route of routes) {
    smStream.write({
      url: route,
      changeFreq: "weekly",
      priority: 0.9,
    });
  }

  smStream.end();

  const sitemap = (await streamToPromise(smStream)).toString();

  fs.writeFileSync(resolveCwd(publicDir, "sitemap.xml"), sitemap);
};

module.exports = buildSitemap;
