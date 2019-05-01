import React from 'react'

import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'

const FourOhFour = () => (
  <Layout>
    <Head pageTitle="404" />
    <Hero className="has-text-centered">
      <img
        src="https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif"
        alt="404"
      />
    </Hero>
  </Layout>
)

export default FourOhFour
