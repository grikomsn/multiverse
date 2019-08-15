const withPlugins = require('next-compose-plugins')

module.exports = withPlugins([
  [require('@zeit/next-css')],
  [require('@zeit/next-sass')],
  [require('next-offline')],
  [require('next-optimized-images')],
  [require('next-purgecss')],
])
