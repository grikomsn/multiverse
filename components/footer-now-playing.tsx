import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'

import AppContext from '../store/app'
import A from './a'

function FooterNowPlaying() {
  const { nowPlaying } = React.useContext(AppContext)

  const motionProps: HTMLMotionProps<'div'> = {
    animate: nowPlaying ? 'loaded' : 'loading',
    variants: {
      loading: { height: 0, opacity: 0 },
      loaded: { height: 'auto', opacity: 1 },
    },
  }

  return (
    <motion.div {...motionProps}>
      {nowPlaying && (
        <React.Fragment>
          <motion.span initial="initial" whileHover="hovering">
            <div className="md:inline-block md:pr-1">Now playing:</div>

            <A href={nowPlaying.songUrl}>
              <b>{nowPlaying.title}</b> by <b>{nowPlaying.artist}</b>
              {!nowPlaying.isPlaying && ' (paused)'}
            </A>

            <A href={nowPlaying.songUrl}>
              <motion.div
                className="absolute pb-8 w-32"
                style={{ left: 'calc(50% - 4rem)' }}
                variants={{
                  initial: { opacity: 0, scale: 0, y: -120 },
                  hovering: { opacity: 1, scale: 1, y: -160 },
                }}
                children={
                  <img
                    src={nowPlaying.albumImageUrl}
                    alt={nowPlaying.album}
                    className="rounded shadow"
                  />
                }
              />
            </A>
          </motion.span>
        </React.Fragment>
      )}
    </motion.div>
  )
}

export default FooterNowPlaying
