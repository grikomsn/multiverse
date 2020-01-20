import { NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

import Main from '../../components/main'

function Page({ Component }) {
  return (
    <Main>
      <Component />
    </Main>
  )
}

Page.getInitialProps = async (ctx: NextPageContext) => {
  const Component = dynamic(() => import(`../../content/${ctx.query.page}.mdx`))
  return { Component }
}

export default Page
