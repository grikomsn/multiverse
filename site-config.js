const path = require('path')

module.exports = {
  siteTitle: 'Griko Nibras',
  siteTitleShort: 'Griko Nibras',
  siteDescription:
    'Griko Nibras is a software engineer from Surabaya, Indonesia. ' +
    'Love working on web technologies like Laravel, Node, and React ' +
    'frameworks, especially Gatsby and Next.',
  siteUrl: 'https://griko.id',
  themeColor: '#357EDD',
  backgroundColor: '#FFFFFF',
  pathPrefix: null,
  logo: path.resolve(__dirname, 'src/images/icon.png'),
  social: {
    disqus: 'griko',
    twitter: 'griko_nibras',
  },
}
