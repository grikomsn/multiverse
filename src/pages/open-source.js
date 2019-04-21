import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import Link from '../components/Link'

const OpenSource = ({ data }) => (
  <Layout>
    <Head pageTitle="Open Source" />
    <Hero className="content">
      <h1>
        Open Source <i className="e1a-sparkles" />
      </h1>
      <p>
        Here are GitHub repositories that I authored, contribute, and maintain
      </p>
      <br />
      {data.repos.edges.map(({ node }) => (
        <React.Fragment key={node.type}>
          <h6>{node.type}</h6>
          <ul>
            {node.repos.map(({ name, description, url }) => (
              <li key={name}>
                <Link href={url} normal>
                  <b>{name}</b> - {description}
                </Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </Hero>
  </Layout>
)

OpenSource.propTypes = {
  data: PropTypes.object.isRequired,
}

export default OpenSource

export const query = graphql`
  {
    repos: allOpenSourceJson {
      edges {
        node {
          type
          repos {
            url
            name
            description
          }
        }
      }
    }
  }
`
