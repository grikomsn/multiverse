const withPlugins = require('next-compose-plugins')

module.exports = withPlugins([
  [require('next-offline'), {}],
  [require('next-optimized-images'), {}],
  [require('@zeit/next-css'), {}],
  [require('@zeit/next-sass'), {}],
  [require('next-purgecss'), {}],
])
