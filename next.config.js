const { client, gql } = require("./src/lib/cms-client");

module.exports = {
  // https://nextjs.org/docs/basic-features/image-optimization#domains
  images: {
    domains: ["images.ctfassets.net"],
  },

  // https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,

  async rewrites() {
    const data = await client.request(gql`
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
