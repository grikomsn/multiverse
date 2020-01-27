import { HTMLMotionProps, motion } from 'framer-motion'
import { useRouter } from 'next/dist/client/router'
import React from 'react'

import AppContext from '../store/app'
import A from './a'

function FooterNowPlaying() {
  const { nowPlaying } = React.useContext(AppContext)
  const npExists = nowPlaying && nowPlaying.isPlaying

  const router = useRouter()

  const motionProps: HTMLMotionProps<'div'> = {
    animate: npExists && router.asPath !== '/now-playing' ? 'show' : 'hide',
    variants: {
      hide: { height: 0, opacity: 0 },
      show: { height: 'auto', opacity: 1 },
    },
  }

  return (
    <motion.div {...motionProps}>
      {npExists && (
        <React.Fragment>
          <motion.span initial="initial" whileHover="hovering">
            <div className="md:inline-block md:pr-1">Now playing:</div>

            <A href={nowPlaying.songUrl}>
              {nowPlaying.isPlaying ? '▶ ' : '⏸ '}
              <b>{nowPlaying.title}</b> by <b>{nowPlaying.artist}</b>
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
