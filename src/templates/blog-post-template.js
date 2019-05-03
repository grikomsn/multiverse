import 'prism-themes/themes/prism-base16-ateliersulphurpool.light.css'

import { DiscussionEmbed } from 'disqus-react'
import { graphql, Link } from 'gatsby'
import React from 'react'

import { siteUrl, social } from '../../site-config'
import Head from '../components/Head'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import parsePostDate from '../helpers/parsePostDate'

// eslint-disable-next-line react/prop-types
const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark.frontmatter
  const { previous, next } = pageContext

  const disqusProps = {
    shortname: social.disqus,
    config: {
      title: post.title,
      identifier: location.pathname,
      url: siteUrl + location.pathname,
    },
  }

  return (
    <Layout>
      <Head pageTitle={post.title} siteDescription={post.spoiler} />
      <Hero className="content">
        <h1 className="title">{post.title}</h1>
        <p className="subtitle">{post.spoiler}</p>
        <small className="has-text-muted">
          Published at {parsePostDate(post.date)}
        </small>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
        <hr />
        {(previous || next) && (
          <div className="buttons is-centered">
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </div>
        )}
        <hr />
        <DiscussionEmbed {...disqusProps} />
      </Hero>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        spoiler
      }
    }
  }
`

export default BlogPostTemplate
