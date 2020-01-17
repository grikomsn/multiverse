const withPlugins = require('next-compose-plugins')

module.exports = withPlugins(
  [
    // first loaded plugins
    [require('@zeit/next-sass')],
    [require('next-optimized-images')],
    [
      require('@next/mdx')({ extension: /\.mdx?$/ }),
      { pageExtensions: ['tsx', 'mdx'] },
    ],
  ],
  { target: 'serverless' }
)
