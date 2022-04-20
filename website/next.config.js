// @ts-check
/// <reference types="@project/types/vercel" />
/// <reference path="./env.d.ts" />

const { withSuperjson } = require("next-superjson");
const withTranspileModules = require("next-transpile-modules");
const packageJson = require("./package.json");
const metadataJson = require("./config/metadata.json");

const cspHeader = `
  child-src *.twitter.com;
  connect-src *;
  default-src 'self';
  font-src 'self' *.${metadataJson.domain};
  img-src * blob: data:;
  media-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.${metadataJson.domain};
  style-src 'self' 'unsafe-inline' *.${metadataJson.domain};
`
  .replace(/^\s+/, "")
  .trim();

/** @type {import("next").NextConfig} */
let nextConfig = {
  env: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
    GRAPHQL_TOKEN: process.env.GRAPHQL_TOKEN,
  },
  eslint: {
    dirs: ["config", "hooks", "lib", "pages", "store", "ui", "utils"],
    ignoreDuringBuilds: Boolean(process.env.VERCEL),
  },
  experimental: {
    runtime: "edge",
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: cspHeader.replace(/\n/g, "") },
        { key: "Permissions-Policy", value: "camera=(), geolocation=(), interest-cohort=(), microphone=()" },
        { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
      ],
    },
  ],
  reactStrictMode: false, // TODO: enable after headless and radix has been updated for react 18
  redirects: async () => [
    { source: "/writings", destination: "/blog", permanent: true },
    { source: "/writings/:match*", destination: "/blog/:match*", permanent: true },
    { source: "/time", destination: "/playground/time", permanent: true },
    { source: "/projects", destination: "/work", permanent: true },
    { source: "/works", destination: "/work", permanent: true },
  ],
  rewrites: async () => [],
  typescript: {
    ignoreBuildErrors: Boolean(process.env.VERCEL),
  },
  webpack: (config, { dev, isServer, webpack }) => {
    config.plugins.push(new webpack.DefinePlugin({ __DEV__: dev, __PROD__: !dev }));
    if (!isServer) {
      Object.assign(config.resolve.alias, {
        graphql: "graphql-web-lite",
      });
    }
    return config;
  },
};

nextConfig = withSuperjson()(nextConfig);

const localModules = Object.keys(packageJson.dependencies).filter((dep) => dep.startsWith("@project/"));
nextConfig = withTranspileModules(localModules)(nextConfig);

module.exports = nextConfig;
