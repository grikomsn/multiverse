/* eslint-disable react/prop-types */
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import React from 'react'
import styled from 'styled-components'

import Email from '../components/Email'
import Hero from '../components/Hero'
import Layout from '../components/Layout'

const Ainami = styled(Img)`
  cursor: pointer;
  filter: drop-shadow(0 6px 3px rgba(0, 0, 0, 0.3));
  margin: auto;
  margin-bottom: 1rem;
  max-width: 300px;
  transform: scale(1.02);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.08) rotate(1deg);
    filter: drop-shadow(0 6px 6px rgba(0, 0, 0, 0.2));
  }

  &:active {
    transform: scale(1.04) rotate(0.5deg);
  }
`

const Index = ({ data }) => (
  <Layout className="has-background-warning" hideFooter>
    <Hero className="has-text-centered" centered>
      <figure className="image">
        <Ainami fluid={data.img.childImageSharp.fluid} />
      </figure>
      <br />
      <h1 className="title is-marginless">Hey there, I am Griko Nibras.</h1>
      <br />
      <p>
        I am a software engineer from Surabaya, Indonesia. Love working on web
        technologies like Laravel, Node.js, React, and Vue. Currently working on
        my bachelor thesis and Nine Twenty One.
      </p>
      <br />
      <p>
        Say hello via email at <Email to="hello@griko.id" />,<br />
        or to <Email to="griko@pm.me" /> for private matters.
      </p>
    </Hero>
  </Layout>
)

export default Index

export const query = graphql`
  {
    img: file(relativePath: { eq: "Ainami.png" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
