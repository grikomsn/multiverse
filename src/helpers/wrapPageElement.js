import Transition from 'components/transition'
import PropTypes from 'prop-types'
import React from 'react'

const wrapPageElement = ({ element, props }) => {
  return <Transition {...props}>{element}</Transition>
}

wrapPageElement.propTypes = {
  element: PropTypes.any,
  props: PropTypes.any,
}

export default wrapPageElement
