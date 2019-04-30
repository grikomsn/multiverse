import { graphql, StaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import React from 'react'
import styled from 'styled-components'

const Sig = styled(Img)`
  margin: auto;
  max-width: 128px;
`

const Signature = () => (
  <StaticQuery
    query={graphql`
      {
        sig: file(relativePath: { eq: "Signature.png" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => (
      <Sig alt="Signature" fluid={data.sig.childImageSharp.fluid} />
    )}
  />
)

export default Signature
