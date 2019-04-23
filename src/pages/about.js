import { Link as GatsbyLink } from 'gatsby'
import React from 'react'

import Email from '../components/Email'
import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import Link from '../components/Link'
import Signature from '../components/Signature'

const About = () => (
  <Layout>
    <Head pageTitle="About" />
    <Hero className="max-width-tablet">
      <h1 className="title">
        My name is Griko Muhammad Sultan Nibras. That’s too long, so I mostly
        use Griko Nibras.
      </h1>
      <br />
      <p>
        Born, raised and currently living in Surabaya, Indonesia. Currently
        working on my bachelor’s degree in Informatics on Artificial
        Intelligence at{' '}
        <Link href="https://itats.ac.id">
          Institut Teknologi Adhi Tama Surabaya
        </Link>
        , and also working on{' '}
        <Link href="https://ninetwenty.one">Nine Twenty One</Link>.
      </p>
      <br />
      <p>
        Mostly working on Laravel, Node.js, React stuff like Gatsby.js and
        Next.js, and also Vue.js. Also a little bit of Docker and server stuff.
        Worked on several freelance and collaborative projects, mostly internal
        dashboards and private information systems.
      </p>
      <br />
      <p>
        Outside the programming-verse, I hang around various social medias,
        mostly Twitter. I also hang around at co-working spaces and coffee
        shops. I don’t play games that much anymore, but still hunt some sales
        on Steam or Origin.
      </p>
      <br />
      <p>
        Have something to work on? Or just saying hello? Do send an email to{' '}
        <Email to="hello@griko.id" /> or to <Email to="griko@pm.me" /> for
        private matters, or reach out at any social medias{' '}
        <GatsbyLink to="/links" style={{ color: 'inherit' }}>
          <b>listed here</b>
        </GatsbyLink>
        .
      </p>
      <br />
      <p>
        <small>
          P.S. I am still working on this landing page, more pages coming soon{' '}
          <i className="e1a-sparkles" />
        </small>
      </p>
      <br />
      <div className="has-text-centered">
        <Signature />
      </div>
    </Hero>
  </Layout>
)

export default About
