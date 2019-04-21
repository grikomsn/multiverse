import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import PropTypes from 'prop-types'
import React from 'react'

import Email from '../components/Email'
import Hero from '../components/Hero'
import Layout from '../components/Layout'

const Index = ({ data }) => (
  <Layout className="has-background-warning" hideFooter>
    <Hero className="has-text-centered max-width-tablet">
      <figure className="image">
        <Img
          fluid={data.img.childImageSharp.fluid}
          style={{ maxWidth: '300px', margin: 'auto' }}
        />
      </figure>
      <br />
      <h1 className="title is-marginless">Hey there, I am Griko Nibras.</h1>
      <br />
      <p>
        I am a software engineer from Surabaya, Indonesia. Love working on web
        technologies like Laravel, Node.js, React stuff like Gatsby.js and
        Next.js, and also Vue.js. Currently working on my bachelor thesis and
        Nine Twenty One.
      </p>
      <br />
      <p>
        Say hello via email at <Email to="hello@griko.id" />,<br />
        or to <Email to="griko@pm.me" /> for private matters.
      </p>
    </Hero>
  </Layout>
)

Index.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Index

export const query = graphql`
  {
    img: file(relativePath: { eq: "Ainami.png" }) {
      childImageSharp {
        fluid(maxWidth: 384) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
