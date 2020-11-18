module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
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
