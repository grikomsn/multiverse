const path = require("path");

const headers = require("./config/headers");
const redirects = require("./config/redirects");

/** @type {import("next/dist/next-server/server/config-shared").NextConfig} */
module.exports = {
  // https://github.com/vercel/next.js/blob/canary/packages/next/next-server/server/config-shared.ts#L42-L65
  experimental: {
    conformance: true,
    optimizeCss: true,
    optimizeImages: true,
    scrollRestoration: true,
    workerThreads: true,
  },

  // https://nextjs.org/docs/api-reference/next.config.js/headers
  headers,

  // https://nextjs.org/docs/basic-features/image-optimization#domains
  images: {
    domains: [
      "datocms-assets.com",
      "pbs.twimg.com",
      //
    ],
  },

  // https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,

  // https://nextjs.org/docs/api-reference/next.config.js/redirects
  redirects,

  // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
  /**
   * @param {import("webpack").Configuration} config
   * @param {boolean} x.dev
   * @param {import("webpack").Compiler} x.webpack
   */
  webpack(config, { defaultLoaders, dev, webpack }) {
    // https://github.com/belgattitude/nextjs-monorepo-example/blob/16eceafc9300a268436f007bf0ec2a40953751f9/apps/web-app/next.config.js#L22-L39
    // https://github.com/vercel/next.js/pull/13542
    const resolvedBaseUrl = path.resolve(config.context, "../../");
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        include: [resolvedBaseUrl],
        use: defaultLoaders.babel,
        exclude: (excludePath) => {
          return /node_modules/.test(excludePath);
        },
      },
    ];

    config.plugins.push(new webpack.DefinePlugin({ __DEV__: dev }));

    return config;
  },
};
