// @ts-check

require("cross-fetch/polyfill");

const copyPublicAssets = require("./copy-public-assets");
const generateRss = require("./generate-rss");
const generateFavicons = require("./generate-favicons");

const { client, gql } = require("../src/lib/cms-client");

async function build() {
  const data = await client.request(gql`
    {
      blogPostCollection(order: postedAt_DESC) {
        items {
          title
          slug
          subtitle
          postedAt
          tags
        }
      }
    }
  `);

  const posts = data.blogPostCollection.items;

  await copyPublicAssets();
  await generateRss({ posts });
  await generateFavicons();
}

build();
