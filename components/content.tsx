import cns from '@sindresorhus/class-names'
import React from 'react'

export interface ContentProps extends React.ComponentProps<'article'> {
  compact?: boolean
}

function Content({ className, compact = true, ...props }: ContentProps) {
  return (
    <article
      className={cns(compact && 'max-w-3xl mx-auto', className)}
      {...props}
    />
  )
}

export default Content
