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
    <Hero>
      <h1 className="title">
        List of Links <i className="e1a-link" />
      </h1>
      <p>
        Here is a list of various links, some are available as shortcuts (e.g.
        my GitHub can be accessed with{' '}
        <Link href="https://griko.dev/github">griko.dev/github</Link>)
      </p>
      <br />
      <div className="content">
        {data.links.edges.map(({ node }) => (
          <React.Fragment key={node.name}>
            <h6>{node.name}</h6>
            <ul>
              {node.links.sort().map(({ link, description }) => (
                <li key={link}>
                  <Link href={link} normal>
                    <b>{trimProtocol(link)}</b> &mdash; {description}
                  </Link>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
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
          links {
            link
            description
          }
        }
      }
    }
  }
`
