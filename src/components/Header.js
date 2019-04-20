import React from 'react'
import posed from 'react-pose'

import HeaderNav from './HeaderNav'

const AnimatedContainer = posed.div({
  enter: {
    y: 0,
    transition: { ease: 'easeInOut' },
  },
  exit: {
    y: '-100%',
    transition: { ease: 'easeInOut' },
  },
})

const Header = () => (
  <AnimatedContainer>
    <HeaderNav />
  </AnimatedContainer>
)

export default Header
