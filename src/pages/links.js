import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import Link from '../components/Link'
import trimProtocol from '../helpers/trimProtocol'

const Links = ({ data }) => (
  <Layout>
    <Head pageTitle="Links" />
    <Hero className="content">
      <h1>
        List of Links &nbsp;
        <i className="e1a-link" />
      </h1>
      <p>
        Here is a list of various links, some are available as shortcuts (e.g.
        my GitHub can be accessed with{' '}
        <Link href="https://griko.dev/github">griko.dev/github</Link>)
      </p>
      <br />
      {data.links.edges.map(({ node }) => (
        <React.Fragment key={node.name}>
          <h6>{node.name}</h6>
          <ul>
            {node.links.sort().map(link => (
              <li key={link}>
                <Link href={link}>{trimProtocol(link)}</Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </Hero>
  </Layout>
)

Links.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Links

export const query = graphql`
  {
    links: allLinksJson {
      edges {
        node {
          name
          links
        }
      }
    }
  }
`
