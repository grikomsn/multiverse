import React from 'react'

import A from './a'

function Footer() {
  return (
    <footer className="p-4 text-center text-gray-400 text-xs transition-colors">
      &copy; Griko Nibras {new Date().getFullYear()}. Made with{' '}
      <A href="https://nextjs.org" bold children="Next.js" />,{' '}
      <A href="https://tailwindcss.com" bold children="Tailwind CSS" />, and{' '}
      <A href="https://www.framer.com/motion" bold children="Framer Motion" />.
      Hosted on <A href="https://zeit.co/now" bold children="Zeit Now" />.
    </footer>
  )
}

export default Footer
