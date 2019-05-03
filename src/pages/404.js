import React from 'react'

import Head from '../components/Head'
import Layout from '../components/Layout'

const FourOhFour = () => (
  <Layout>
    <Head pageTitle="404" />
    <div className="hero is-fullheight-with-navbar">
      <div className="hero-body">
        <div className="container has-text-centered">
          <figure className="image">
            <img
              src="https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif"
              alt="404"
            />
          </figure>
        </div>
      </div>
    </div>
  </Layout>
)

export default FourOhFour
