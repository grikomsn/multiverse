import React from 'react'

import wrapPageElementWithTransition from './src/helpers/wrapPageElement'
import AppProvider from './src/store/provider'

// React Context in Browser
// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => {
  return <AppProvider>{element}</AppProvider>
}

// Page Transitions
export const wrapPageElement = wrapPageElementWithTransition
