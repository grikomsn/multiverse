require("cross-fetch/polyfill");

const { client } = require("../src/cms");

const buildFavicons = require("./build-favicons");
const buildRss = require("./build-rss");
const buildSitemap = require("./build-sitemap");

async function build() {
  const {
    favicon,
    blogPosts,
    siteConfig,
  } = await client.request(/* GraphQL */ `
    {
      favicon: upload(filter: { notes: { matches: { pattern: "favicon" } } }) {
        url
      }
      blogPosts: allBlogPosts(orderBy: postedAt_DESC) {
        title
        slug
        subtitle
        postedAt
        tags
      }
      siteConfig {
        title
        description
        url
        twitterUsername
        email
        links
        socials
      }
    }
  `);

  await buildFavicons({ favicon, siteConfig });
  await buildRss({ blogPosts, siteConfig });
  await buildSitemap({ blogPosts, siteConfig });
}

build();
