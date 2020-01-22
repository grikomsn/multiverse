import React from 'react'

import A from './a'

function Footer() {
  return (
    <footer className="p-4 text-center text-gray-400 text-xs transition-colors">
      Made with <A href="https://nextjs.org" bold children="Next.js" />,{' '}
      <A href="https://tailwindcss.com" bold children="Tailwind CSS" />,{' '}
      <A href="https://www.framer.com/motion" bold children="Framer Motion" />,{' '}
      and <A href="https://contentful.com" bold children="Contentful" />. Hosted
      on <A href="https://zeit.co/now" bold children="Zeit Now" />. Source
      licensed under the{' '}
      <A href="https://griko.dev/landing-page" bold children="MIT License" />.
    </footer>
  )
}

export default Footer
