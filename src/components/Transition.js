import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import posed, { PoseGroup } from 'react-pose'

import { timeout } from '../constants/transition'

class Transition extends PureComponent {
  render() {
    const { children, location } = this.props

    const RoutesContainer = posed.div({
      enter: { opacity: 1, delay: timeout, delayChildren: timeout },
      exit: { opacity: 0 },
    })

    return (
      <PoseGroup animateOnMount>
        <RoutesContainer key={location.pathname}>{children}</RoutesContainer>
      </PoseGroup>
    )
  }
}

Transition.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
}

export default Transition
