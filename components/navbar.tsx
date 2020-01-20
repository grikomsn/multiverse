import cns from '@sindresorhus/class-names'
import Link from 'next/link'
import React from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import useDarkMode from 'use-dark-mode'

function Navbar() {
  const routes = [
    { to: '/mdx/[page]', as: '/mdx/test-1', title: 'MDX Test' },
    { to: '/mdx/[page]', as: '/mdx/test-2', title: 'MDX Test 2' },
    { to: '/about', title: 'About' },
    { to: '/contact', title: 'Contact' },
  ]

  const darkMode = useDarkMode(false)

  return (
    <nav className="flex flex-col md:flex-row text-center md:text-left justify-between">
      <div className="flex-grow">
        <Link href="/" passHref>
          <a className="font-bold p-4 pr-1 tracking-tighter">Griko Nibras</a>
        </Link>
        <button
          className="px-1 py-4"
          onClick={darkMode.toggle}
          aria-label="Toggle dark mode"
          children={darkMode.value ? <FiMoon /> : <FiSun />}
        />
      </div>

      <div className="mt-4 text-sm md:text-base">
        {routes.map(({ to, title, as = null }, index) => (
          <Link href={to} as={as} key={title} passHref>
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
