require("cross-fetch/polyfill");

const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const siteConfig = require("./site-config");

module.exports = {
  experimental: {
    optimizeFonts: true,
    optimizeImages: true,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
      new FaviconsWebpackPlugin({
        logo: "./src/public/favicon.png",
        cache: true,
        devMode: "light",
        inject: true,
        mode: "webapp",
        favicons: {
          appDescription: siteConfig.description,
          appName: siteConfig.title,
          appShortName: siteConfig.title,
          developerName: siteConfig.title,
          developerURL: siteConfig.url,
          icons: {
            android: true,
            appleIcon: true,
            appleStartup: true,
            favicons: true,
            firefox: true,
            windows: true,
          },
        },
      }),
    );
    return config;
  },
};
