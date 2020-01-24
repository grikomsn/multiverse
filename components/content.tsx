import cns from '@sindresorhus/class-names'
import React from 'react'

export interface ContentProps extends React.ComponentProps<'article'> {
  isBlogPost?: boolean
  compact?: boolean
}

function Content({
  className,
  compact = true,
  isBlogPost = false,
  ...props
}: ContentProps) {
  return (
    <article
      className={cns(
        compact && 'max-w-3xl mx-auto',
        isBlogPost && 'blog-post',
        className
      )}
      {...props}
    />
  )
}

export default Content
