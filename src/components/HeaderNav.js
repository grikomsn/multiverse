/* eslint-disable jsx-a11y/anchor-is-valid */
import cns from '@sindresorhus/class-names'
import { graphql, Link, StaticQuery } from 'gatsby'
import React, { useState } from 'react'
import styled from 'styled-components'

const Icon = styled.img`
  margin-right: 1rem;
`

const routes = [
  { name: 'Blog', route: '/blog' },
  { name: 'Open Source', route: '/open-source' },
  { name: 'Socials', route: '/socials' },
  { name: 'About', route: '/about' },
]

const HeaderNav = () => {
  const [navState, setNavState] = useState(false)
  const toggleNavState = () => setNavState(!navState)

  const activeClass = { 'is-active': navState }
  const burgerClass = cns('navbar-burger', 'burger', activeClass)
  const navMenuClass = cns('navbar-menu', 'has-text-centered', activeClass)

  return (
    <StaticQuery
      query={graphql`
        {
          img: file(relativePath: { eq: "Ainami.png" }) {
            childImageSharp {
              fluid(maxWidth: 192) {
                src
                srcSet
              }
            }
          }
        }
      `}
      render={data => (
        <nav className="navbar is-warning">
          <div className="navbar-brand">
            <div className="navbar-padding" />

            <Link to="/" className="navbar-item">
              <Icon alt="Ainami" {...data.img.childImageSharp.fluid} />
              &nbsp;
              <b>Griko Nibras</b>
            </Link>
            <a
              role="button"
              className={burgerClass}
              onClick={toggleNavState}
              onKeyPress={toggleNavState}
              tabIndex={0}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>

          <div className={navMenuClass}>
            <div className="navbar-end">
              {routes.map(({ name, route }) => (
                <Link
                  to={route}
                  className="navbar-item"
                  key={name}
                  activeClassName="is-active"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
          <div className="navbar-padding" />
        </nav>
      )}
    />
  )
}

export default HeaderNav
