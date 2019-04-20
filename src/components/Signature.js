import { graphql, StaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

const Sig = styled.img`
  max-width: 128px;
  margin: auto;
`

const Signature = () => (
  <StaticQuery
    query={graphql`
      {
        sig: imageSharp(fluid: { originalName: { eq: "Signature.png" } }) {
          fluid {
            src
            srcSet
          }
        }
      }
    `}
    render={data => <Sig alt="Signature" {...data.sig.fluid} />}
  />
)

export default Signature
