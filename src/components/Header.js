import React from 'react'
import posed from 'react-pose'

import { timeout } from '../constants/transition'
import HeaderNav from './HeaderNav'

const AnimatedContainer = posed.div({
  enter: {
    y: 0,
    transition: { duration: timeout },
  },
  exit: {
    y: '-100%',
    transition: { duration: timeout },
  },
})

const Header = () => (
  <AnimatedContainer>
    <HeaderNav />
  </AnimatedContainer>
)

export default Header
