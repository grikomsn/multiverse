import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import Email from '../components/Email'
import Hero from '../components/Hero'
import Layout from '../components/Layout'

const Ainami = styled.img`
  max-width: 300px;
  margin: auto;
`

const Index = ({ data }) => (
  <Layout className="has-background-warning" hideFooter>
    <Hero className="has-text-centered max-width-tablet">
      <figure className="image">
        <Ainami alt="Ainami" {...data.img.fluid} />
      </figure>
      <br />
      <h1 className="title is-marginless">Hey there, I am Griko Nibras.</h1>
      <br />
      <p>
        I am a software engineer from Surabaya, Indonesia. Love working on web
        technologies like Laravel, Node.js, React stuff like Gatsby.js and
        Next.js, and Vue.js. Currently working on my bachelor thesis and Nine
        Twenty One.
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
    img: imageSharp(fluid: { originalName: { eq: "Ainami.png" } }) {
      fluid(maxWidth: 300) {
        src
        srcSet
      }
    }
  }
`
