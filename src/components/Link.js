import PropTypes from 'prop-types'
import React from 'react'

const Link = ({ children, ...props }) => (
  <a rel="noopener noreferrer" target="_blank" {...props}>
    {children}
  </a>
)

Link.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Link
