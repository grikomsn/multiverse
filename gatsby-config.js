const siteConfig = require('./site-config')

module.exports = {
  siteMetadata: { ...siteConfig },
  plugins: [
    // Exclude plugin
    {
      resolve: 'gatsby-plugin-exclude',
      options: { paths: ['/legacy/**'] },
    },
    // Remark Plugins
    // {
    //   resolve: 'gatsby-transformer-remark',
    //   options: {
    //     plugins: [
    //       'gatsby-remark-copy-linked-files',
    //       'gatsby-remark-prismjs',
    //       'gatsby-remark-responsive-iframe',
    //       'gatsby-remark-smartypants',
    //       {
    //         resolve: 'gatsby-remark-external-links',
    //         options: { target: '_blank', rel: 'noopener noreferrer' },
    //       },
    //       {
    //         resolve: 'gatsby-remark-images',
    //         options: { showCaptions: true, tracedSVG: true },
    //       },
    //     ],
    //   },
    // },
    // Other Plugins
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-webpack-size',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        runtimeCaching: [
          {
            urlPattern: /(\.js$|\.css$|static\/)/,
            handler: 'cacheFirst',
          },
          {
            urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
            handler: 'staleWhileRevalidate',
          },
          {
            urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
            handler: 'staleWhileRevalidate',
          },
          // {
          //   urlPattern: /^https?:\/\/griko\.id\/blog.*/,
          //   handler: 'staleWhileRevalidate',
          // },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'content', path: `${__dirname}/content` },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'images', path: `${__dirname}/src/images` },
    },
    // Last-priority Plugins
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        develop: true,
        ignore: ['prismjs', 'tachyons'],
        printAll: true,
        printRejected: true,
        whitelistPatternsChildren: [/^content$/],
      },
    },
  ],
}
