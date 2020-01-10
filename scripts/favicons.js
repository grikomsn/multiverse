const favicons = require('favicons')
const fs = require('fs')
const path = require('path')

const config = require('../site-config')

const iconsDir = path.resolve(__dirname, '../public/icons/')
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir)
}

favicons(
  path.join(__dirname, '../images/me.png'),
  {
    path: '/icons/',
    appName: config.title,
    appShortName: config.title,
    appDescription: config.description,
    developerName: config.title,
    developerURL: config.url,
    background: '#0096FF',
    theme_color: '#0096FF',
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      coast: false,
      favicons: true,
      firefox: false,
      windows: true,
      yandex: false,
    },
    logging: true,
  },
  (error, { files, images }) => {
    if (error) {
      console.error(error.message)
    }

    images.forEach(image => {
      fs.writeFile(
        path.resolve(iconsDir, image.name),
        image.contents,
        error => error && console.error(error)
      )
    })

    files.forEach(file => {
      fs.writeFile(
        path.resolve(__dirname, '../public/', file.name),
        file.contents,
        error => error && console.error(error)
      )
    })
  }
)
