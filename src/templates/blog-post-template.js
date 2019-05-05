import 'prism-theme-ainami-dark/prism-bulma.min.css'

import { DiscussionEmbed } from 'disqus-react'
import { graphql, Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

import { siteUrl, social } from '../../site-config'
import Head from '../components/Head'
import Layout from '../components/Layout'
import Section from '../components/Section'
import parsePostDate from '../helpers/parsePostDate'

// https://css-tricks.com/flexbox-truncated-text
const Buttons = styled.div`
  justify-content: space-between;

  .button {
    flex: 1 1 0;
    min-width: 0;

    small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`

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

  const btnClass = 'button remove-animation'

  return (
    <Layout>
      <Head pageTitle={post.title} siteDescription={post.spoiler} />
      <Section className="content">
        <h1 className="title is-spaced">{post.title}</h1>
        <p className="subtitle">{post.spoiler}</p>
        <small>Published on {parsePostDate(post.date)}</small>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
        <br />
        {(previous || next) && (
          <Buttons className="buttons">
            {previous && (
              <Link to={previous.fields.slug} className={btnClass} rel="prev">
                ← <small>&nbsp;{previous.frontmatter.title}</small>
              </Link>
            )}
            {next && (
              <Link to={next.fields.slug} className={btnClass} rel="next">
                <small>{next.frontmatter.title}&nbsp;</small> →
              </Link>
            )}
          </Buttons>
        )}
        <br />
        <DiscussionEmbed {...disqusProps} />
      </Section>
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
