import '../stylesheets/style.scss'

import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import Footer from './Footer'
import Head from './Head'
import Header from './Header'

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`

const Layout = ({ children, hideFooter, ...props }) => (
  <>
    <Head />
    <LayoutWrapper {...props}>
      <Header />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </LayoutWrapper>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  hideFooter: PropTypes.bool,
}

export default Layout
