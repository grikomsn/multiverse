import React from 'react'

import Link from '../components/Link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer has-background-dark has-text-light has-text-centered">
      <small>
        <p>
          Handcrafted with <i className="e1a-heart" /> by myself. Copyright
          &copy; {currentYear}. <br />
          Made with{' '}
          <Link href="https://bulma.io" resetColor>
            <b>Bulma</b>
          </Link>{' '}
          and{' '}
          <Link href="https://gatsbyjs.org" resetColor>
            <b>GatsbyJS</b>
          </Link>
          .
        </p>
        <br />
        <p>
          Hosted on{' '}
          <Link href="https://zeit.co/now" resetColor>
            <b>ZEIT Now</b>
          </Link>
          . Source available on{' '}
          <Link href="https://github.com/grikomsn/landing-page" resetColor>
            <b>GitHub</b>
          </Link>
          .
        </p>
      </small>
    </footer>
  )
}

export default Footer
