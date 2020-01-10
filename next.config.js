const withPlugins = require('next-compose-plugins')

module.exports = withPlugins(
  [
    // first loaded plugins
    [require('@zeit/next-sass')],
    [require('next-optimized-images')],
  ],
  { target: 'serverless' }
)
