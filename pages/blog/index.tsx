import { NextPageContext } from 'next'
import { NextSeo } from 'next-seo'
import React from 'react'

import Content from '../../components/content'
import Main from '../../components/main'
import PostEntry, { PostEntryProps } from '../../components/post-entry'
import contentful from '../../services/contentful'

interface BlogProps extends React.ComponentProps<'div'> {
  postEntries: PostEntryProps[]
}

function Blog({ postEntries }: BlogProps) {
  return (
    <Main>
      <NextSeo title="Blog" />
      <Content>
        <h1>Blog Posts</h1>
        <p>
          Thoughts, shareables, anything that I'd like to write and publish.
        </p>

        <br />

        <div>
          {postEntries.map(post => (
            <PostEntry {...post} key={post.slug} />
          ))}
        </div>
      </Content>
    </Main>
  )
}

Blog.getInitialProps = async (_ctx: NextPageContext) => {
  const entries = await contentful.getEntries({
    content_type: 'blogPosts',
    limit: 10,
    select: [
      'fields.heroImage',
      'fields.title',
      'fields.slug',
      'fields.description',
      'fields.postDate',
    ],
    order: '-fields.postDate',
  })

  const postEntries = entries.items.map(({ fields }: any) => ({
    ...fields,
    heroImage: `https:${fields.heroImage.fields.file.url}?w=1280&h=640&fit=fill`,
    postDate: new Date(fields.postDate).toLocaleDateString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }))

  return { postEntries }
}

export default Blog
