import { motion } from 'framer-motion'
import { NextSeo } from 'next-seo'
import React from 'react'

import A from '../components/a'
import Content from '../components/content'
import Main from '../components/main'
import AppContext from '../store/app'

function NowPlaying() {
  const { nowPlaying: np } = React.useContext(AppContext)
  const npExists = np && np.isPlaying

  const title = npExists
    ? `${np.isPlaying ? '▶' : '⏸'} "${np.title}" by ${np.artist}`
    : 'Now Playing'

  const description = npExists
    ? `Currently playing "${np.title} by ${np.artist}"`
    : 'View what I am currently playing on Spotify'

  return (
    <Main>
      <NextSeo
        title={title}
        description={description}
        openGraph={{ title, description }}
      />

      <Content className="text-center">
        {npExists ? (
          <React.Fragment>
            <A href={np.songUrl} className="text-gray-100 hover:text-gray-100">
              <motion.img
                src={np.albumImageUrl}
                alt={np.album}
                className="max-w-sm mx-auto rounded-lg shadow-lg"
                whileHover={{ y: -6 }}
              />
            </A>

            <h2 className="mb-1">
              {np.isPlaying ? '▶' : '⏸'} {np.title}
            </h2>

            <p className="mt-1 mb-6">{np.artist}</p>

            <A
              href={np.songUrl}
              className="hover:bg-gray-800 border border-gray-100 px-4 py-2 rounded text-gray-100 hover:text-gray-100 text-sm transition-colors"
              children="View song on Spotify"
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p>Currently I am not playing anything...</p>
          </React.Fragment>
        )}
      </Content>
    </Main>
  )
}

export default NowPlaying
