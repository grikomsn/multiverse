import 'inter-ui/inter-hinted.css'
import 'tachyons/css/tachyons.min.css'

import React from 'react'
import styled from 'styled-components'

import BlueBorder from './BlueBorder'
import Footer from './Footer'
import Head from './Head'
import Header from './Header'

const LayoutWrapper = styled.div`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'avenir next', avenir,
    'helvetica neue', helvetica, ubuntu, roboto, noto, 'segoe ui', arial,
    sans-serif;
`

const Layout = ({ children, className }) => (
  <>
    <Head />
    <BlueBorder className="fixed top-0 left-0 right-0" />
    <LayoutWrapper className="center dark-gray flex flex-column justify-between min-vh-100 mw8 pa4 sans-serif">
      <Header />
      <main className={className}>{children}</main>
      <Footer />
    </LayoutWrapper>
  </>
)

export default Layout
