import { graphql } from 'gatsby'
import React from 'react'

import { ExtLink as A, Head, Layout } from '../components'
import { trimProtocol } from '../helpers'

const Listify = ({ name = '', links = [] }) => (
  <>
    <b>{name}</b>
    <ul className="list pl0">
      {links.map(({ description, link }) => (
        <li key={description}>
          {description} - <A href={link}>{trimProtocol(link)}</A>
        </li>
      ))}
    </ul>
  </>
)

const About = ({ data }) => {
  const list = data.allContactJson.edges
    .map(({ node }) => ({ ...node, key: node.name }))
    .map(props => <Listify {...props} />)

  return (
    <Layout className="lh-copy">
      <Head pageTitle="Contact" />
      <h1 className="f2-l f3 lh-title mt0 tracked-tight">Contact</h1>

      <p className="measure">
        Get in touch via email at{' '}
        <A href="mailto:hello@griko.id" ext={false} children="hello@griko.id" />{' '}
        or at <A href="mailto:griko@pm.me" ext={false} children="griko@pm.me" />{' '}
        for sensitive matters. You can also contact or view my public accounts
        via these links below.
      </p>

      {list}
    </Layout>
  )
}

export default About

export const query = graphql`
  {
    allContactJson {
      edges {
        node {
          name
          links {
            description
            link
          }
        }
      }
    }
  }
`
