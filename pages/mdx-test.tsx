import { NextSeo } from 'next-seo'
import React from 'react'

import Content from '../components/content'
import Main from '../components/main'
import Test from '../contents/test.mdx'

function Contact() {
  return (
    <Main>
      <NextSeo title="Test" />
      <Content>
        <Test />
      </Content>
    </Main>
  )
}

export default Contact
