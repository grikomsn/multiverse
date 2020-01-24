if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const withPlugins = require('next-compose-plugins')

module.exports = withPlugins(
  [
    // first loaded plugins
    [require('@zeit/next-sass')],
    [require('next-optimized-images')],
  ],
  {
    env: {
      CONTENTFUL_SPACE: process.env.CONTENTFUL_SPACE,
      CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    },
    target: 'serverless',
  }
)
