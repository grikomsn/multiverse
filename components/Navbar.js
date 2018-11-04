import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NextLink from './NextLink'
import metadata from '../metadata'

const NavbarSocials = () =>
  metadata.links.filter(link => link.isPrimary).map(c => (
    <NextLink href={c.href} target="_blank" className="navbar-item" key={c.id}>
      <FontAwesomeIcon icon={c.classFontAwesome} fixedWidth />
    </NextLink>
  ))

export default () => (
  <nav className="navbar">
    <div className="navbar-brand">
      <div className="navbar-start is-flex">
        <NavbarSocials />
      </div>
      <div className="navbar-end is-flex">
        <NextLink href="/" className="navbar-item">
          About
        </NextLink>

        <NextLink href="/socials" className="navbar-item">
          Socials
        </NextLink>

        <a
          href={`mailto:${metadata.email}`}
          className="navbar-item is-hidden-mobile">
          Contact
        </a>
      </div>
    </div>
    <style jsx>{`
      .navbar-brand {
        width: 100%;
      }
      .navbar-end {
        margin-left: auto;
      }
    `}</style>
  </nav>
)
