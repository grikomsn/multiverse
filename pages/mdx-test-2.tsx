import { NextSeo } from 'next-seo'
import React from 'react'

import Content from '../components/content'
import Main from '../components/main'
import Test2 from '../contents/test-2.mdx'

function Contact() {
  return (
    <Main>
      <NextSeo title="Test" />
      <Content>
        <Test2 />
      </Content>
    </Main>
  )
}

export default Contact
