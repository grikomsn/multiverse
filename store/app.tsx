import React from 'react'

import { isDev } from '../pages/api/_lib/utils'
import { NowPlaying } from '../types'

export interface AppContextDefaultValuesProps {
  nowPlaying: NowPlaying
}

export const defaultValue: AppContextDefaultValuesProps = {
  nowPlaying: null,
}

const AppContext = React.createContext(defaultValue)

export function AppProvider({ children }) {
  const [nowPlaying, setNowPlaying] = React.useState<NowPlaying>(null)

  React.useEffect(() => {
    const nowPlayingUri = isDev
      ? 'http://localhost:3000/api/now-playing'
      : 'https://griko.id/api/now-playing'

    if (typeof window !== 'undefined') {
      window
        .fetch(nowPlayingUri)
        .then(res => res.json())
        .then((np: NowPlaying) => {
          setNowPlaying(np)
        })
    }
  }, [])

  return <AppContext.Provider value={{ nowPlaying }} children={children} />
}

export default AppContext
