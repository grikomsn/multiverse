import { STATUS_CODES } from 'http'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import React from 'react'

import Content from '../components/content'
import Main from '../components/main'

function ErrorPage({ statusCode }) {
  const title = `${statusCode}: ${STATUS_CODES[statusCode]}`
  return (
    <Main>
      <NextSeo title={title} />
      <Content>
        <h1>{title}</h1>
        <p>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
          . Go back to <Link href="/" passHref children={<a>home page</a>} />.
        </p>
      </Content>
    </Main>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage
