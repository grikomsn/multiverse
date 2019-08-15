import 'tachyons/css/tachyons.min.css'

import React from 'react'

import BlueBorder from './BlueBorder'
import Footer from './Footer'
import Head from './Head'
import Header from './Header'

const Layout = ({ children, className }) => (
  <>
    <Head />
    <BlueBorder className="fixed top-0 left-0 right-0" />
    <div className="center dark-gray flex flex-column justify-between min-vh-100 mw8 pa4 sans-serif">
      <Header />
      <main className={'f4-l f5 ' + className}>{children}</main>
      <Footer />
    </div>
  </>
)

export default Layout
