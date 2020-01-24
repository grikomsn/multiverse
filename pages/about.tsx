import { NextSeo } from 'next-seo'
import Link from 'next/link'
import React from 'react'

import A from '../components/a'
import Content from '../components/content'
import KB from '../components/kb'
import Main from '../components/main'
import kb from '../data/kb'

function About() {
  return (
    <Main>
      <NextSeo title="About" />
      <Content>
        <h1>About Me</h1>
        <p>
          My name is <b>Griko Muhammad Sultan Nibras</b>. That’s too long, so I
          mostly use <b>Griko Nibras</b>.
        </p>
        <p>
          Born, raised, and currently living in Surabaya, Indonesia. Currently
          working on my bachelor’s degree in Informatics on Artificial
          Intelligence at{' '}
          <A href="https://itats.ac.id">
            Institut Teknologi Adhi Tama Surabaya
          </A>
          .
        </p>
        <p>
          I am one of the organizer-slash-committee for Surabaya's
          JavaScript-focused community,{' '}
          <A href="https://surabayajs.org">SurabayaJS</A>. In my spare time, I
          contribute to open source projects on GitHub, one of which is{' '}
          <A href="https://github.com/reactjs/id.reactjs.org">
            translating React docs to Indonesian
          </A>
          .
        </p>
        <p>
          Outside the programming universe, I mess around on Twitter, or hanging
          out at coffee shops to ease my mind for a moment. I don’t play games
          that much anymore, but still hunt some sales on Steam and Origin.
        </p>

        <br />

        <h3 className="mb-0">Knowledge Base</h3>
        <div className="flex flex-wrap">
          {kb.map(kb => (
            <KB {...kb} key={kb.title} className="w-1/2" />
          ))}
        </div>

        <br />

        <h3>Contact</h3>
        <p>
          Visit the <Link href="/contact" children={<a>contact page</a>} /> for
          more information.
        </p>
      </Content>
    </Main>
  )
}

export default About
