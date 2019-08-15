import React from 'react'

import A from '../components/ExtLink'
import Layout from '../components/Layout'
import Link from '../components/Link'

const Index = () => (
  <Layout>
    <h1 className="f1-l f2 lh-title mt0">
      Hello there. I am a software engineer from Surabaya, Indonesia. Love
      working on web technologies like{' '}
      <A className="orange" href="https://laravel.com" children={'Laravel'} />,{' '}
      <A className="green" href="https://nodejs.org" children={'Node'} />, and{' '}
      <A href="https://reactjs.org" children={'React'} /> frameworks, especially{' '}
      <A className="purple" href="https://gatsbyjs.org" children={'Gatsby'} />
      {' and '}
      <A className="gray" href="https://nextjs.org" children={'Next'} />.
    </h1>

    <p className="lh-copy mb0">
      Get in touch via email at{' '}
      <A href="mailto:hello@griko.id" ext={false} children="hello@griko.id" />{' '}
      or visit the <Link to="/contact">contact page</Link> for more information.
    </p>
  </Layout>
)

export default Index
