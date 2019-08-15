import { graphql } from 'gatsby'
import React from 'react'

import Ellipsis from '../components/Ellipsis'
import A from '../components/ExtLink'
import Head from '../components/Head'
import Layout from '../components/Layout'
import Link from '../components/Link'

const Listify = ({ title = '', list = [], full = false }) => (
  <div className={`fl mv0 w-${full ? '100' : '50'}`}>
    <b>{title}</b>
    <ul className="list pl0">
      {list.map(s => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  </div>
)

const About = ({ data }) => {
  const lists = data.allAboutJson.edges
    .map(({ node }) => ({ ...node, key: node.title }))
    .map(props => <Listify {...props} />)

  return (
    <Layout className="measure lh-copy">
      <Head pageTitle="About" />

      <h1 className="f2-l f3 lh-title mt0 tracked-tight">
        My name is Griko Muhammad Sultan Nibras. That’s too long, so I mostly
        use Griko Nibras.
      </h1>

      <p>
        Born, raised, and currently living in Surabaya, Indonesia. Currently
        working on my bachelor’s degree in Informatics on Artificial
        Intelligence at{' '}
        <A href="https://itats.ac.id">Institut Teknologi Adhi Tama Surabaya</A>.
      </p>

      <p>
        I am one of the organizer for Surabaya's JavaScript-focused community,{' '}
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

      <Ellipsis />

      <h3 className="f3-l f4">Knowledge Base</h3>

      {lists}

      <Ellipsis />

      <h3 className="f3-l f4">Contact</h3>

      <p>
        Visit the <Link to="/contact">contact page</Link> for more information.
      </p>
    </Layout>
  )
}

export default About

export const query = graphql`
  {
    allAboutJson {
      edges {
        node {
          title
          list
        }
      }
    }
  }
`
