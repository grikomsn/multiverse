import * as Contentful from 'contentful'

const host =
  process.env.NODE_ENV === 'development'
    ? 'preview.contentful.com'
    : 'cdn.contentful.com'

const client = Contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  host,
})

export default client
