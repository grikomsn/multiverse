import cns from '@sindresorhus/class-names'
import PropTypes from 'prop-types'
import React from 'react'

const Link = ({ children, resetColor, ...props }) => (
  <a
    rel="noopener noreferrer"
    target="_blank"
    className={cns({ 'reset-color': resetColor })}
    {...props}
  >
    {children}
  </a>
)

Link.propTypes = {
  children: PropTypes.node.isRequired,
  resetColor: PropTypes.bool,
}

export default Link
