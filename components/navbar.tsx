import cns from '@sindresorhus/class-names'
import Link from 'next/link'
import React from 'react'

function Navbar() {
  const routes = [
    { to: '/blog', title: 'Blog' },
    { to: '/appearances', title: 'Appearances' },
    { to: '/works', title: 'Works' },
    { to: '/about', title: 'About' },
    { to: '/contact', title: 'Contact' },
  ]

  return (
    <nav className="flex flex-col md:flex-row text-center md:text-left justify-between">
      <div className="flex-grow mt-4">
        <Link href="/" passHref>
          <a className="font-bold md:ml-2 px-2 py-4 tracking-tighter">
            Griko Nibras
          </a>
        </Link>
      </div>

      <div className="text-sm md:text-base mt-4">
        {routes.map(({ to, title }, index) => (
          <Link href={to} key={title} passHref>
            <a
              className={cns({
                'md:mr-2': index === routes.length - 1,
                'px-2 py-4': true,
              })}
              children={title}
            />
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
