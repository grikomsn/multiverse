import React from 'react'

export interface KBProps extends React.ComponentProps<'div'> {
  title: string
  data: string[]
}

function KB({ title, data, ...props }: KBProps) {
  return (
    <div {...props}>
      <h5>{title}</h5>
      <ul>
        {data.map((d, index) => (
          <li key={index}>{d}</li>
        ))}
      </ul>
    </div>
  )
}

export default KB
