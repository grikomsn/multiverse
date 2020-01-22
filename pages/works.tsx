import { motion } from 'framer-motion'
import { NextPageContext } from 'next'
import { NextSeo } from 'next-seo'
import React from 'react'

import A from '../components/a'
import Content from '../components/content'
import Main from '../components/main'
import contentful from '../services/contentful'

type ShowcaseEntry = {
  title: string
  description: string
  url: string
  tags: string[]
  image: string
}

interface WorksProps extends React.ComponentProps<'div'> {
  showcaseEntries: ShowcaseEntry[]
}

function Works({ showcaseEntries }: WorksProps) {
  return (
    <Main>
      <NextSeo title="Works" />
      <Content className="text-center" compact={false}>
        <h1>Creations and Projects</h1>
        <p>
          Hand-picked collection of what I've done in the past and what I'm
          currently working on.
        </p>

        <br />

        <div className="flex flex-wrap justify-center">
          {showcaseEntries.map(({ title, description, image, url, tags }) => (
            <div className="lg:w-1/2 mb-8" key={title}>
              <motion.div whileHover={{ y: -6 }}>
                <A href={url}>
                  <img src={image} alt={title} />
                </A>
              </motion.div>
              <A href={url}>
                <h3>{title}</h3>
              </A>
              <p className="max-w-lg mx-auto">{description}</p>
              <div className="text-gray-500 text-xs">
                {tags.map(tag => (
                  <span
                    className="border border-gray-600 mx-1 px-2 py-1 rounded"
                    key={tag}
                    children={tag}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Content>
    </Main>
  )
}
Works.getInitialProps = async (_ctx: NextPageContext) => {
  const entries = await contentful.getEntries({
    content_type: 'showcase',
    order: '-sys.createdAt',
  })

  const showcaseEntries = entries.items.map(({ fields }: any) => ({
    ...fields,
    image: `https:${fields.image.fields.file.url}?w=1280&h=768`,
  }))

  return { showcaseEntries }
}

export default Works
