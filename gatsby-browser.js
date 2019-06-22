import React from 'react'

import wrapPageElementWithTransition from './src/helpers/wrapPageElement'
import AppProvider from './src/store/provider'

// https://www.gatsbyjs.org/docs/browser-apis/#onClientEntry
export const onClientEntry = () => {
  if (/https:\/\/bulma\.io\/expo/.test(document.referrer)) {
    window.location.href = 'https://v2.griko.id'
  }
}

// https://www.gatsbyjs.org/docs/browser-apis/#wrapPageElement
export const wrapPageElement = wrapPageElementWithTransition

// https://www.gatsbyjs.org/docs/browser-apis/#wrapRootElement
// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => {
  return <AppProvider>{element}</AppProvider>
}
