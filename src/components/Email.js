import PropTypes from 'prop-types'
import React from 'react'

import Link from './Link'

const Email = ({ to, ...props }) => (
  <Link href={`mailto:${to}`} {...props}>
    {to}
  </Link>
)
Email.propTypes = { to: PropTypes.string.isRequired }

export default Email
