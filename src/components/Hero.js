import cns from '@sindresorhus/class-names'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const HeroBody = styled.div`
  ${props => (props.centered ? '' : 'align-items: unset !important;')}
`

const Hero = ({ children, className, centered, ...props }) => (
  <section className="hero is-fullheight-with-navbar">
    <HeroBody className="hero-body" centered={centered}>
      <div className={cns('container', className)} {...props}>
        {children}
      </div>
    </HeroBody>
  </section>
)

Hero.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.object,
  centered: PropTypes.bool,
}

export default Hero
