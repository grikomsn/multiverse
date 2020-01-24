import { NextPageContext } from 'next'
import { NextSeo } from 'next-seo'
import React from 'react'
import Disqus from 'react-disqus-comments'

import Content from '../../components/content'
import Main from '../../components/main'
import PostContent from '../../components/post-content'
import { PostEntryProps } from '../../components/post-entry'
import contentful from '../../services/contentful'

interface BlogPostProps extends React.ComponentProps<'div'> {
  post: PostEntryProps
  url: string
}

function BlogPost({ post, url }: BlogPostProps) {
  return (
    <Main>
      <NextSeo
        title={post.title}
        description={post.description}
        openGraph={{
          title: post.title,
          description: post.description,
          type: 'article',
          article: {
            publishedTime: post.postDate,
            tags: post.tags,
          },
          images: [
            {
              url: post.heroImage,
              width: 1600,
              height: 900,
              alt: post.title,
            },
          ],
        }}
      />

      <Content isBlogPost>
        <img
          src={post.heroImage}
          alt={post.title}
          className="mt-2 mb-6 rounded shadow-lg"
        />

        <h1>{post.title}</h1>
        <div className="mb-4">{post.description}</div>

        <small>
          Published on{' '}
          {new Date(post.postDate).toLocaleDateString('en', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          <span className="mx-2"> / </span>
          {post.tags}
        </small>

        <hr className="border-gray-800 my-6" />

        <PostContent content={post.content} />

        <br />

        <Disqus
          shortname="griko-nibras"
          identifier={post.slug}
          title={post.title}
          url={url}
        />
      </Content>
    </Main>
  )
}

BlogPost.getInitialProps = async (ctx: NextPageContext) => {
  const data = await contentful.getEntries({
    content_type: 'blogPosts',
    'fields.slug': ctx.query.slug,
  })

  const fields = data.items[0].fields as any
  const post = {
    ...fields,
    heroImage: `https:${fields.heroImage.fields.file.url}?w=1600&h=900&fit=fill`,
  }

  return { post, url: `https://griko.id${ctx.asPath}` }
}

export default BlogPost
