import React from 'react'

import Link from './ExtLink'

const A = props => <Link className="dark-gray" {...props} />

const Footer = () => (
  <footer className="f7 gray lh-copy mt4">
    <p>
      Made with <A href="https://tachyons.io" children="Tachyons" />
      {' and '}
      <A href="https://gatsbyjs.org" children="Gatsby.js" />. Hosted on{' '}
      <A href="https://zeit.co/now" children="ZEIT Now" />.
      <br />
      Source code licensed under the{' '}
      <A
        href="https://github.com/grikomsn/landing-page"
        children="MIT License"
      />
      .
    </p>
  </footer>
)

export default Footer
