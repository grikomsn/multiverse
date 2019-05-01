import cns from '@sindresorhus/class-names'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const HeroBody = styled.div`
  align-items: unset !important;
`

const Hero = ({ children, className, ...props }) => (
  <section className="hero is-fullheight-with-navbar">
    <HeroBody className="hero-body">
      <div className={cns('container', className)} {...props}>
        {children}
      </div>
    </HeroBody>
  </section>
)

Hero.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.object,
}

export default Hero
