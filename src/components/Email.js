import PropTypes from 'prop-types'
import React from 'react'

const Email = ({ to, ...props }) => (
  <a href={'mailto:' + to} {...props}>
    {to}
  </a>
)

Email.propTypes = {
  to: PropTypes.string.isRequired,
}

export default Email
