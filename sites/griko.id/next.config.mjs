/// <reference types="@packages/types/vercel" />

/* eslint-disable import/no-mutable-exports */

import meta from "./config/meta.cjs";
import { WebpackMdxLoader } from "./lib/mdx/webpack-loader.mjs";

import { withSuperjson } from "next-superjson";
import withTranspileModules from "next-transpile-modules";
import { dedent } from "ts-dedent";

const repository = "https://github.com/grikomsn/personal-websites";

const csp = dedent`
  child-src *.twitter.com;
  connect-src *;
  default-src 'self';
  font-src 'self';
  img-src * blob: data:;
  media-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.griko.id;
  style-src 'self' 'unsafe-inline';
`;

/**
 * @type {import("next").NextConfig}
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
let nextConfig = {
  eslint: {
    ignoreDuringBuilds: Boolean(process.env.VERCEL),
  },

  images: {
    domains: [
      "twemoji-cdn.griko.id",
      //
    ],
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

  pageExtensions: ["md", "mdx", "ts", "tsx", "js", "jsx"],

  productionBrowserSourceMaps: true,

  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/blog/:match*",
        destination: "/writings/:match*",
        permanent: true,
      },
      {
        source: "/commit/:sha",
        destination: `${repository}/:sha`,
        permanent: false,
      },
      {
        source: "/github",
        destination: meta.links.GitHub,
        permanent: true,
      },
      {
        source: "/linkedin",
        destination: meta.links.LinkedIn,
        permanent: true,
      },
      {
        source: "/polywork",
        destination: meta.links.Polywork,
        permanent: true,
      },
      {
        source: "/resume",
        destination: meta.links.Resume,
        permanent: true,
      },
      {
        source: "/polywork",
        destination: meta.links.Polywork,
        permanent: true,
      },
      {
        source: "/timeline",
        destination: meta.links.Polywork,
        permanent: false,
      },
      {
        source: "/twitter",
        destination: meta.links.Twitter,
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/social.png",
        destination: "/api/opengraph/main",
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: Boolean(process.env.VERCEL),
  },

  webpack(config, { defaultLoaders, dev, isServer, webpack }) {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [defaultLoaders.babel, WebpackMdxLoader],
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: dev,
        __PROD__: !dev,
      }),
    );

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

nextConfig = withSuperjson()(nextConfig);
nextConfig = withTranspileModules([
  "@packages/assets",
  "@packages/hooks",
  "@packages/utils",
  //
])(nextConfig);

export default nextConfig;
