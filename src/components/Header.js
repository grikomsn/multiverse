import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  padding-top: 0.5rem;
`

const Nav = styled(Link).attrs(({ last = false }) => ({
  activeClassName: 'gray',
  className: `dark-gray dim link pv4 pl2 ${last ? 'pr0' : 'pr2'}`,
}))``

Nav.propTypes = { last: PropTypes.bool }

const Header = () => (
  <HeaderWrapper className="fl mb4 w-100">
    <div className="fl">
      <Link to="/" className="b dark-gray dim link pv4 tracked-tight">
        <span className="dib-l dn">Griko Nibras</span>
        <span className="dn-l dib">GN</span>
      </Link>
    </div>

    <div className="fr tr f5-l f6">
      <Nav to="/about" children="About" />
      {/* <Nav to="/blog">Blog</Nav> */}
      <Nav to="/works" children="Works" />
      <Nav to="/contact" children="Contact" />
    </div>
  </HeaderWrapper>
)

export default Header
