/// <reference types="@packages/types/vercel" />

/* eslint-disable import/no-mutable-exports */

import { withSuperjson } from "next-superjson";
import withTranspileModules from "next-transpile-modules";

const csp = `
  child-src *.twitter.com;
  connect-src *;
  default-src 'self';
  font-src 'self';
  img-src * blob: data:;
  media-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.griko.id;
  style-src 'self' 'unsafe-inline';
`
  .replace(/^\s+/, "")
  .trim();

/**
 * @type {import("next").NextConfig}
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
let nextConfig = {
  eslint: {
    ignoreDuringBuilds: Boolean(process.env.VERCEL),
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp.replace(/\n/g, ""),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  productionBrowserSourceMaps: true,

  reactStrictMode: true,

  async redirects() {
    return [
      // TODO: remove when website is complete
      {
        source: "/(.*)",
        destination: "https://gitlab.com/grikomsn/landing-page-v2",
        permanent: false,
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: Boolean(process.env.VERCEL),
  },

  webpack(config, { dev, webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: dev,
        __PROD__: !dev,
      }),
    );

    return config;
  },
};

nextConfig = withSuperjson()(nextConfig);
nextConfig = withTranspileModules([
  "@packages/assets",
  "@packages/hooks",
  "@packages/utils",
  //
])(nextConfig);

export default nextConfig;
