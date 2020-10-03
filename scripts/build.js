require("cross-fetch/polyfill");

const copyPublicAssets = require("./copy-public-assets");
const generateRss = require("./generate-rss");

const { contentful } = require("../src/cms");

async function build() {
  const data = await contentful().request(/* GraphQL */ `
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

  copyPublicAssets();
  generateRss({ posts });
}

build();
