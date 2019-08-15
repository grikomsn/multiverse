import cns from '@sindresorhus/class-names'
import PropTypes from 'prop-types'
import React from 'react'

const Section = ({ children, className, ...props }) => (
  <section className="section">
    <div className={cns('container', className)} {...props}>
      {children}
    </div>
  </section>
)
Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.object,
}

export default Section
