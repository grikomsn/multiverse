import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NextLink from './NextLink'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import metadata from '../metadata'

const FooterSocials = () =>
  metadata.links.filter(link => link.isPrimary).map(c => (
    <NextLink
      href={c.href}
      target="_blank"
      className="button is-dark is-rounded"
      key={c.id}>
      <FontAwesomeIcon icon={c.classFontAwesome} fixedWidth />
    </NextLink>
  ))

export default () => (
  <footer className="footer has-background-dark has-text-light">
    <div className="container has-text-centered">
      <div className="buttons">
        <FooterSocials />
      </div>
      <small>
        Handcrafted with <FontAwesomeIcon icon={faHeart} fixedWidth /> by
        myself. Copyright &copy; {new Date().getFullYear()}.<br />
        Made with{' '}
        <a href="https://bulma.io/" target="_blank" className="has-text-light">
          <b>Bulma</b>
        </a>
        {' and '}
        <a
          href="https://nextjs.org/"
          target="_blank"
          className="has-text-light">
          <b>Next.js</b>
        </a>
        .<br />
        <br />
        Hosted and source code available on{' '}
        <a
          href="https://github.com/grikomsn/landing-page"
          target="_blank"
          className="has-text-light">
          <b>GitHub</b>
        </a>
        .
      </small>
    </div>
    <style jsx>{`
      .buttons {
        justify-content: center;
      }
    `}</style>
  </footer>
)
