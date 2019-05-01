import { graphql, Link as GatsbyLink } from 'gatsby'
import Img from 'gatsby-image'
import React from 'react'
import styled from 'styled-components'

import Email from '../components/Email'
import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import Link from '../components/Link'

const Sig = styled(Img)`
  margin: auto;
  margin-top: 2rem;
  max-width: 128px;
`

// eslint-disable-next-line react/prop-types
const About = ({ data }) => (
  <Layout>
    <Head pageTitle="About" />
    <Hero className="content">
      <h1 className="title">
        My name is Griko Muhammad Sultan Nibras. That’s too long, so I mostly
        use Griko Nibras.
      </h1>
      <p>
        Born, raised, and living in Surabaya, Indonesia. Currently working on my
        bachelor’s degree in Informatics on Artificial Intelligence at{' '}
        <Link href="https://itats.ac.id">
          Institut Teknologi Adhi Tama Surabaya
        </Link>
        , and also working on{' '}
        <Link href="https://ninetwenty.one">Nine Twenty One</Link>.
      </p>
      <p>
        I love working on web technologies like Laravel, Node.js, React, and
        Vue. Also a little bit of Java (Hibernate), Docker, and server related
        things. I have worked on several collaborative projects, mostly internal
        dashboards, private information systems, and campus lab projects such as{' '}
        <Link href="https://inforlabs.net">Inforlabs</Link>.
      </p>
      <p>
        I also attend and participate in local tech communities such as{' '}
        <Link href="https://surabayajs.org">SurabayaJS</Link> and{' '}
        <Link href="http://surabayadev.org">SurabayaDev</Link>. Outside the
        programming-verse, I hang around on Twitter, or coffee shops and
        co-working spaces in real life. I don’t play games that much anymore,
        but still hunt some sales on Steam and Origin.
      </p>
      <p>
        Have something to work on? Or just saying hello? Do send an email to{' '}
        <Email to="hello@griko.id" /> or to <Email to="griko@pm.me" /> for
        private matters, or reach out at any social medias{' '}
        <GatsbyLink to="/socials">listed here</GatsbyLink>.
      </p>
      <div className="has-text-centered">
        <Sig alt="Signature" fluid={data.sig.childImageSharp.fluid} />
      </div>
    </Hero>
  </Layout>
)

export default About

export const query = graphql`
  {
    sig: file(relativePath: { eq: "Signature.png" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
