/* eslint-disable no-unused-vars */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

import wrapPageElementWithTransition from './src/helpers/wrapPageElement'
import AppProvider from './src/store/provider'

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}) => {
  const ConnectedBody = () => <AppProvider>{bodyComponent}</AppProvider>
  replaceBodyHTMLString(renderToString(<ConnectedBody />))

  const sheet = new ServerStyleSheet()
  const bodyHTML = renderToString(sheet.collectStyles(<ConnectedBody />))
  const styleElement = sheet.getStyleElement()
  setHeadComponents(styleElement)
}

export const wrapPageElement = wrapPageElementWithTransition
