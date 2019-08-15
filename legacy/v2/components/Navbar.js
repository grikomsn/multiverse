import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cns from '@sindresorhus/class-names'
import { useState } from 'react'
import { Bounce, Fade } from 'react-reveal'

import metadata from '../metadata'
import Link from './ExternalLink'
import IAmInterested from './IAmInterested'
import NextLink from './NextLink'

const NavbarSocials = () =>
  metadata.links
    .filter(link => link.isPrimary)
    .map(c => (
      <Link href={c.href} className="navbar-item" aria-label={c.id} key={c.id}>
        <FontAwesomeIcon icon={c.classFontAwesome} fixedWidth />
      </Link>
    ))

const Navbar = () => {
  const [modalState, setModalState] = useState(false)
  const [navbarState, setNavbarState] = useState(false)

  const toggleModal = () => setModalState(!modalState)
  const toggleNavbar = () => setNavbarState(!navbarState)

  const modalActiveClass = { 'is-active': modalState }
  const navbarActiveClass = { 'is-active': navbarState }
  const burgerClass = cns('navbar-burger', 'burger', navbarActiveClass)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <NavbarSocials />
          <a className={burgerClass} onClick={toggleNavbar}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div className={cns('navbar-menu', navbarActiveClass)}>
          <div className="navbar-end">
            <NextLink href="/" className="navbar-item">
              About
            </NextLink>
            <NextLink href="/socials" className="navbar-item">
              Socials
            </NextLink>
            <a className="navbar-item" onClick={toggleModal}>
              Contact
            </a>
          </div>
        </div>
      </nav>

      <Fade duration={300} when={modalState}>
        <div className={cns('modal', modalActiveClass)}>
          <div className="modal-background" onClick={toggleModal} />
          <Bounce top>
            <div className="modal-card has-text-centered">
              <section className="modal-card-body has-text-centered">
                <IAmInterested />
              </section>
              <br />
              <small className="has-text-light">
                You can dismiss this by clicking or tapping the background.
              </small>
            </div>
          </Bounce>
        </div>
      </Fade>

      <style global jsx>{`
        html,
        body {
          overflow: ${modalState ? 'hidden' : 'initial'};
        }

        .modal-card {
          max-width: 800px;
          width: 100%;
        }

        .modal-card-body {
          border-radius: 4px;
          margin: 0.5rem;
          padding: 4rem 1rem;
        }

        .navbar-burger {
          z-index: 5;
        }
      `}</style>
    </>
  )
}

export default Navbar
