import React from 'react'

import Head from '../components/Head'
import Layout from '../components/Layout'

const NotFound = ({ location }) => (
  <Layout>
    <Head pageTitle="404" />
    <h1 className="f-headline solid">404 Not Found</h1>
    <p>
      <code className="ba b--gray bg-gray br2 ph2 pv1 white">
        {location.href}
      </code>{' '}
      does not contain anything. Bummer.
    </p>
  </Layout>
)

export default NotFound
