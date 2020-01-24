// https://github.com/lailo-ch/next-with-tailwindcss/blob/master/postcss.config.js

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./components/**/*.tsx', './pages/**/*.tsx'],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
  whitelist: ['html', 'body'],
})

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('postcss-preset-env')({ stage: 1 }),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
}
