import { graphql } from 'gatsby'
import React from 'react'

import Head from '../components/Head'
import Layout from '../components/Layout'
import Link from '../components/Link'
import Section from '../components/Section'
import trimProtocol from '../helpers/trimProtocol'

// eslint-disable-next-line react/prop-types
const Links = ({ data }) => (
  <Layout>
    <Head pageTitle="Links" />
    <Section className="content">
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
                {description && <span>{description} - </span>}
                <Link href={link}>{trimProtocol(link)}</Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </Section>
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
