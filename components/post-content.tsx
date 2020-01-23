import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, Document } from '@contentful/rich-text-types'
import React from 'react'

interface PostContentProps extends React.ComponentProps<'div'> {
  content: Document
}

function PostContent({ content, ...props }: PostContentProps) {
  return (
    <div {...props}>
      {documentToReactComponents(content, {
        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: node => {
            const fields = node.data.target.fields

            if (/image/.test(fields.file.contentType)) {
              return (
                <div className="max-w-xl mx-auto py-2 text-center">
                  <img
                    className="p-2"
                    src={`https:${fields.file.url}`}
                    alt={fields.file.title}
                  />
                  <small>{fields.description}</small>
                </div>
              )
            }

            return null
          },
        },
      })}
    </div>
  )
}

export default PostContent
