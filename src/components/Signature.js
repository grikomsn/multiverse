import { graphql, StaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import React from 'react'

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
      <Img
        alt="Signature"
        fluid={data.sig.childImageSharp.fluid}
        style={{ maxWidth: '128px', margin: 'auto' }}
      />
    )}
  />
)

export default Signature
