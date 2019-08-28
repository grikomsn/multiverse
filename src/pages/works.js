import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import React from 'react'

import { ExtLink as A, Head, Layout } from '../components'
import { trimProtocol } from '../helpers'

const Works = ({ data }) => {
  const metas = data.meta.edges.reduce((acc, { node }) => {
    const { image, ...n } = node
    return { ...acc, [node.image]: n }
  }, {})

  const works = data.img.edges.map(({ node }) => ({
    key: node.fluid.originalName,
    ...metas[node.fluid.originalName],
    ...node,
  }))

  return (
    <Layout className="tc">
      <Head pageTitle="Works" />

      <h1 className="f2-l f3 lh-title mt0 tracked-tight">
        Creations and Works
      </h1>

      <p className="lh-copy mb4">
        Hand-picked collection of what I've done in the past and what I'm
        currently working on.
      </p>

      {works.map(({ name, url, ...w }) => (
        <div className="fl w-50-l w-100 mb4" key={name}>
          <A href={url} children={<Img {...w} />} />
          <p className="lh-copy">
            {name} <br />
            <A href={url}>{trimProtocol(url)}</A>
          </p>
        </div>
      ))}
    </Layout>
  )
}

export default Works

export const query = graphql`
  {
    img: allImageSharp(
      filter: { original: { src: { regex: "/works-.+.png$/" } } }
    ) {
      edges {
        node {
          fluid(quality: 100) {
            ...GatsbyImageSharpFluid
            originalName
          }
        }
      }
    }
    meta: allWorksJson {
      edges {
        node {
          image
          name
          url
        }
      }
    }
  }
`
