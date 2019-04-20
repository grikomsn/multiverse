import cns from '@sindresorhus/class-names'
import PropTypes from 'prop-types'
import React from 'react'

const Hero = ({ children, className, ...props }) => (
  <section className="hero is-fullheight-with-navbar">
    <div className="hero-body">
      <div className={cns('container', className)} {...props}>
        {children}
      </div>
    </div>
  </section>
)

Hero.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.object,
}

export default Hero
