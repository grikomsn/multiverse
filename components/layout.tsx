import React, { ComponentProps } from 'react'

import Footer from './footer'
import Navbar from './navbar'

function Layout(props: ComponentProps<'div'>) {
  return (
    <React.Fragment>
      <div className="flex flex-col justify-between min-h-screen">
        <Navbar />
        <div {...props} />
        <Footer />
      </div>
    </React.Fragment>
  )
}

export default Layout
