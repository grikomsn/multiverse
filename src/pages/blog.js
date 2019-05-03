import { graphql, Link } from 'gatsby'
import React from 'react'

import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import parsePostDate from '../helpers/parsePostDate'

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
        {posts.map(({ fields, frontmatter }) => (
          <Link
            to={fields.slug}
            className="box use-normal remove-animation"
            key={frontmatter.title}
          >
            <h5 className="is-marginless">{frontmatter.title}</h5>
            <div>{frontmatter.spoiler}</div>
            <small className="has-text-grey-light">
              {parsePostDate(frontmatter.date)}
            </small>
          </Link>
        ))}
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
