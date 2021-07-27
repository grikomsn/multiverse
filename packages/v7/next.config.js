const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: true,
});

// https://github.com/leerob/leerob.io/blob/9adc510cbfb3da88c3b0ad15632eb876ca91b607/next.config.js#L39-L49
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  child-src *.twitter.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' fonts.gstatic.com;
`;

/** @type {import("next/dist/next-server/server/config-shared").NextConfig} */
const nextConfig = {
  // https://github.com/vercel/next.js/blob/3b388c346c6990c98e83357ad68263edc7081210/packages/next/server/config-shared.ts#L73-L97
  experimental: {
    conformance: true,
    optimizeCss: true,
    optimizeImages: true,
    workerThreads: true,
  },

  // https://nextjs.org/docs/api-reference/next.config.js/headers
  // https://github.com/leerob/leerob.io/blob/9adc510cbfb3da88c3b0ad15632eb876ca91b607/next.config.js#L51-L88
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // https://vercel.com/support/articles/how-to-enable-cors#enabling-cors-in-a-next.js-app
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: `X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version`,
          },

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
          {
            key: "Cache-Control",
            value: "public, s-maxage=1, stale-while-revalidate=59",
          },

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
          {
            key: "Content-Security-Policy",
            value: csp.replace(/\n/g, ""),
          },

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
          // Opt-out of Google FLoC: https://amifloced.org/
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

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
  async redirects() {
    return [
      // {
      //   source: "/blog/:path*",
      //   destination: "/blog",
      //   permanent: false,
      // },
    ];
  },

  // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
  /**
   * @param {import("webpack").Configuration} config
   * @param {{dev:boolean;isServer:boolean}} opts
   */
  webpack(config, { defaultLoaders, dev, isServer, webpack }) {
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

    // https://github.com/leerob/leerob.io/blob/9adc510cbfb3da88c3b0ad15632eb876ca91b607/next.config.js#L27-L33
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
