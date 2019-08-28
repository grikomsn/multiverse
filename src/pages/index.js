import React from 'react'

import { ExtLink as A, Layout, Link } from '../components'

const Index = () => (
  <Layout grow={false}>
    <h1 className="f1-l f2 lh-title mt0 tracked-tight">
      Hello there. I am a software engineer from Surabaya, Indonesia. Love
      working on web technologies like{' '}
      <A className="orange" href="https://laravel.com" children="Laravel" />,{' '}
      <A className="green" href="https://nodejs.org" children="Node" />, and{' '}
      <A href="https://reactjs.org" children="React" /> frameworks, especially{' '}
      <A className="purple" href="https://gatsbyjs.org" children="Gatsby" />
      {' and '}
      <A className="gray" href="https://nextjs.org" children="Next" />.
    </h1>

    <p className="lh-copy mb0">
      Get in touch via email at{' '}
      <A href="mailto:hello@griko.id" ext={false} children="hello@griko.id" />{' '}
      or visit the <Link to="/contact">contact page</Link> for more information.
    </p>
  </Layout>
)

export default Index
