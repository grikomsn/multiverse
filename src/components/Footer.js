import React from 'react'

import Link from './ExtLink'

const A = ({ href, text }) => (
  <Link className="dark-gray" href={href} children={text} />
)

const Footer = () => (
  <footer className="f7 gray lh-copy mt4">
    <p>
      Made with <A href="https://tachyons.io" text="Tachyons" />
      {' and '}
      <A href="https://gatsbyjs.org" text="Gatsby.js" />. Hosted on{' '}
      <A href="https://zeit.co/now" text="ZEIT Now" />.
      <br />
      Source code licensed under the{' '}
      <A href="https://github.com/grikomsn/landing-page" text="MIT License" />.
    </p>
  </footer>
)

export default Footer
