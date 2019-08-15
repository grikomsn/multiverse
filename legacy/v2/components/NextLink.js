import Link from 'next/link'

const NextLink = ({ children, ...props }) => {
  const { className, ...linkProps } = props
  return (
    <Link {...linkProps}>
      <a {...props}>{children}</a>
    </Link>
  )
}

export default NextLink
