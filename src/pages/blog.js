import { graphql, Link } from 'gatsby'
import React from 'react'

import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'

// eslint-disable-next-line react/prop-types
const Blog = ({ data }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => node)

  return (
    <Layout>
      <Head pageTitle="Blog" />
      <Hero className="content">
        <h1 className="title">
          Blog Posts <i className="e1a-pencil" />
        </h1>
        <p>Posts about the programming-verse and various interesting things</p>
        <ul>
          {posts.map(({ fields, frontmatter }) => (
            <li key={frontmatter.title}>
              <Link to={fields.slug} className="use-normal">
                <b>{frontmatter.title}</b> - {frontmatter.spoiler}
              </Link>
            </li>
          ))}
        </ul>
      </Hero>
    </Layout>
  )
}

export default Blog

export const query = graphql`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
            spoiler
          }
        }
      }
    }
  }
`
