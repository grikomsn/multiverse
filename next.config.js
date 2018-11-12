const webpack = require('webpack')
const withPlugins = require('next-compose-plugins')

module.exports = withPlugins(
  [
    [require('@zeit/next-css')],
    [require('@zeit/next-sass')],
    [require('next-offline')],
    [require('next-optimized-images')],
    [require('next-purgecss')],
  ],
  {
    webpack: config => {
      config.plugins.push(
        new webpack.EnvironmentPlugin({
          GITHUB_TOKEN: process.env.GITHUB_TOKEN,
        })
      )
      return config
    },
  }
)
