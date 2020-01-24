import cns from '@sindresorhus/class-names'
import React from 'react'

interface AProps extends React.ComponentProps<'a'> {
  bold?: boolean
}

function A({ bold, className, ...props }: AProps) {
  return (
    <a
      {...props}
      className={cns({ 'font-semibold tracking-tight': bold }, className)}
      rel="noopener noreferrer"
      target="_blank"
      children={props.children || props.href}
    />
  )
}

export default A
