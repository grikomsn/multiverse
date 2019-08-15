import { Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  padding-top: 0.5rem;
`

const Nav = styled(Link).attrs(({ last = false }) => ({
  activeClassName: 'gray',
  className: `dark-gray dim link pv4 pl2 ${last ? 'pr0' : 'pr2'}`,
}))``

const Header = () => (
  <HeaderWrapper className="f6-m fl mb4 w-100">
    <div className="fl">
      <Link to="/" className="b dark-gray dim link pv4">
        Griko Nibras
      </Link>
    </div>

    <div className="fr tr">
      <Nav to="/about">About</Nav>
      {/* <Nav to="/blog">Blog</Nav> */}
      <Nav to="/contact" last>
        Contact
      </Nav>
    </div>
  </HeaderWrapper>
)

export default Header
