const siteConfig = require('./site-config')

module.exports = {
  siteMetadata: { ...siteConfig },
  plugins: [
    // Remark Plugins
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-prismjs',
          'gatsby-remark-responsive-iframe',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-external-links',
            options: { target: '_blank', rel: 'noopener noreferrer' },
          },
          {
            resolve: 'gatsby-remark-images',
            options: { showCaptions: true, tracedSVG: true },
          },
        ],
      },
    },
    // Other Plugins
    'gatsby-plugin-catch-links',
    'gatsby-plugin-eslint',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-remove-serviceworker',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-webpack-size',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sass',
      options: { includePaths: ['./src/stylesheets'] },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    // Last-priority Plugins
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        develop: true,
        ignore: ['prism-theme-ainami-dark', 'prismjs'],
        printAll: true,
        printRejected: true,
        whitelistPatternsChildren: [/^content$/],
      },
    },
  ],
}
