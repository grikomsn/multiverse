const { contentful } = require("./src/cms");

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    const data = await contentful().request(/* GraphQL */ `
      {
        aboutPage: aboutPageCollection(limit: 1) {
          items {
            avatar {
              url(transform: { format: JPG, height: 1280, width: 1280 })
            }
          }
        }
      }
    `);
    return [
      {
        source: "/me.jpg",
        destination: data.aboutPage.items[0].avatar.url,
      },
      {
        source: "/social-alt.png",
        destination: "/api/social-image",
      },
      {
        source: "/blog/:slug/social.png",
        destination: "/api/social-image/blog/:slug.png",
      },
    ];
  },
};
