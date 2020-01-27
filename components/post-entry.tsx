import { Document } from '@contentful/rich-text-types'
import { HTMLMotionProps, motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

export interface PostEntryProps extends React.ComponentProps<'div'> {
  heroImage: string
  title: string
  slug: string
  description: string
  postDate: string
  tags: string[]
  content?: Document
}

function PostEntry({
  heroImage,
  title,
  slug,
  description,
  postDate,
}: PostEntryProps) {
  const motionProps: HTMLMotionProps<'div'> = {
    whileHover: { y: -6 },
    whileTap: { y: -4 },
    className: 'bg-gray-800 mb-8 rounded shadow-lg',
  }

  return (
    <motion.div {...motionProps}>
      <Link href="/blog/[slug]" as={`/blog/${slug}`} passHref>
        <a className="no-underline text-gray-100 hover:text-gray-100">
          <img src={heroImage} alt={title} className="rounded-t" />
          <div className="p-4 rounded-b">
            <small>{postDate}</small>
            <h3 className="mt-2 mb-0">{title}</h3>
            <p className="mt-2 mb-4">{description}</p>
            <small>Read post &rarr;</small>
          </div>
        </a>
      </Link>
    </motion.div>
  )
}
export default PostEntry
