/* eslint-disable react/prop-types */
import { graphql, Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

import Head from '../components/Head'
import Layout from '../components/Layout'
import Section from '../components/Section'
import parsePostDate from '../helpers/parsePostDate'

const Spoiler = styled.p`
  line-height: initial;
`

const Blog = ({ data }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => node)

  return (
    <Layout>
      <Head pageTitle="Blog" />
      <Section className="content">
        <h1 className="title">
          Blog Posts <i className="e1a-pencil" />
        </h1>
        <p>Posts about the programming-verse and various interesting things</p>
        <br />
        {posts.map(({ fields, frontmatter }) => (
          <Link
            to={fields.slug}
            className="box remove-animation"
            key={frontmatter.title}
          >
            <h5>{frontmatter.title}</h5>
            <Spoiler>{frontmatter.spoiler}</Spoiler>
            <small>Published on {parsePostDate(frontmatter.date)}</small>
          </Link>
        ))}
      </Section>
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
