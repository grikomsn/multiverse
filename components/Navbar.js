import Bounce from 'react-reveal/Bounce'
import { Component } from 'react'
import Fade from 'react-reveal/Fade'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IAmInterested from './IAmInterested'
import NextLink from './NextLink'
import metadata from '../metadata'

const NavbarSocials = () =>
  metadata.links.filter(link => link.isPrimary).map(c => (
    <NextLink href={c.href} target="_blank" className="navbar-item" key={c.id}>
      <FontAwesomeIcon icon={c.classFontAwesome} fixedWidth />
    </NextLink>
  ))

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalState: false,
      navbarState: false,
    }

    this.toggleModal = this.toggleModal.bind(this)
    this.toggleNavbar = this.toggleNavbar.bind(this)
  }

  toggleModal() {
    this.setState({
      modalState: !this.state.modalState,
    })
  }

  toggleNavbar() {
    this.setState({ navbarState: !this.state.navbarState })
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-brand">
            <NavbarSocials />
            <a
              className={`navbar-burger burger ${
                this.state.navbarState ? 'is-active' : ''
              }`}
              onClick={this.toggleNavbar}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>
          <div
            className={`navbar-menu ${
              this.state.navbarState ? 'is-active' : ''
            }`}>
            <div className="navbar-end has-text-centered">
              <NextLink href="/" className="navbar-item">
                About
              </NextLink>

              <NextLink href="/socials" className="navbar-item">
                Socials
              </NextLink>

              <a className="navbar-item" onClick={this.toggleModal.bind(this)}>
                Contact
              </a>
            </div>
          </div>
        </nav>

        <Fade duration={300} when={this.state.modalState}>
          <div className={`modal ${this.state.modalState ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={this.toggleModal} />
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
          .modal-card {
            border-radius: 4px;
            max-width: 800px;
            width: 100%;
          }
          .modal-card-body {
            padding: 4rem 1rem;
          }
          .navbar-burger {
            z-index: 5;
          }
        `}</style>
      </div>
    )
  }
}
