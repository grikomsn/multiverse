import { graphql } from 'gatsby'
import React from 'react'

import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import Link from '../components/Link'
import trimProtocol from '../helpers/trimProtocol'

// eslint-disable-next-line react/prop-types
const Links = ({ data }) => (
  <Layout>
    <Head pageTitle="Links" />
    <Hero className="content">
      <h1 className="title">
        Social Links <i className="e1a-link" />
      </h1>
      <p>
        Here is a list of various social medias and alternate links (e.g.{' '}
        <Link href="https://griko.dev/github">griko.dev/github</Link>)
      </p>
      <br />
      {data.links.edges.map(({ node }) => (
        <React.Fragment key={node.name}>
          <h6>{node.name}</h6>
          <ul>
            {node.links.sort().map(({ link, description }) => (
              <li key={link}>
                <Link href={link} className="use-normal">
                  <b>{trimProtocol(link)}</b> {description && <span>- </span>}
                  {description}
                </Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </Hero>
  </Layout>
)

export default Links

export const query = graphql`
  {
    links: allSocialsJson {
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
