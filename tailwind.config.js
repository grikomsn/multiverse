const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      colors: {
        'dodger-blue': {
          100: '#0096FF',
          200: '#0078CC',
          300: '#0060A3',
          400: '#004D82',
          500: '#003E68',
          600: '#003253',
          700: '#002842',
          800: '#002035',
          900: '#001A2A',
        },
      },
      textColor: theme => theme('colors'),
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
    },
  },
  variants: {},
  plugins: [
    // ...
    require('tailwindcss-transitions')(),
    // ...
  ],
}
