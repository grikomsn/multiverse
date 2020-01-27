import { NowRequest, NowResponse } from '@now/node'
import { randomBytes } from 'crypto'
import SpotifyClient from 'spotify-web-api-node'

import { getRedirectUri, isDev } from './_lib/utils'

// cached variables
let spotify: SpotifyClient
let accessToken: string
let refreshToken: string = process.env.SPOTIFY_REFRESH_TOKEN || null
let state: string

// authentication scopes
const scopes = ['user-read-currently-playing']

// request handler
export default async (req: NowRequest, res: NowResponse) => {
  const redirectUri = getRedirectUri(req)

  if (!state) {
    state = randomBytes(16).toString('hex')
  }

  if (!spotify) {
    spotify = new SpotifyClient({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri,
    })
  }

  if (req.query.code && req.query.state === state) {
    await spotify.authorizationCodeGrant(`${req.query.code}`).then(data => {
      accessToken = data.body.access_token
      spotify.setAccessToken(accessToken)

      refreshToken = data.body.refresh_token
      spotify.setRefreshToken(refreshToken)
    })

    res.statusCode = 308
    res.setHeader('Location', redirectUri)
    res.end()
    return
  }

  if (!accessToken && refreshToken) {
    spotify.setRefreshToken(refreshToken)
    await spotify.refreshAccessToken().then(data => {
      accessToken = data.body.access_token
      spotify.setAccessToken(accessToken)
    })
  }

  if (!accessToken && !refreshToken) {
    const authUrl = spotify.createAuthorizeURL(scopes, state)
    res.statusCode = 401
    res.json({
      message: 'Authentication required',
      ...(isDev ? { authUrl } : {}),
    })
    console.log(`> Authentication required (${authUrl})`)
    return
  }

  try {
    const data = await spotify.getMyCurrentPlayingTrack()

    if (!('is_playing' in data.body)) {
      res.json({})
      console.log('> Currently not playing anything')
      return
    }

    const isPlaying = data.body.is_playing
    const title = data.body.item.name
    const artist = data.body.item.artists.map(artist => artist.name).join(', ')
    const album = data.body.item.album.name
    const albumImageUrl = data.body.item.album.images[0].url
    const songUrl = data.body.item.external_urls.spotify

    res.json({ isPlaying, title, artist, album, albumImageUrl, songUrl })
  } catch (error) {
    console.error(error)
    res.json(error)
  }
}
