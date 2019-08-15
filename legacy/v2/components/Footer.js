import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import metadata from '../metadata'
import Link from './ExternalLink'

const Container = ({ bgClass, textClass, children }) => (
  <footer className={`footer ${bgClass} ${textClass}`}>
    <div className="container has-text-centered">{children}</div>
  </footer>
)

const Footer = ({ bgClass, btnClass, textClass }) => {
  const containerProps = { bgClass, textClass }
  const linkProp = { className: 'has-text-light' }

  return (
    <Container {...containerProps}>
      <div className="buttons" style={{ justifyContent: 'center' }}>
        {metadata.links
          .filter(link => link.isPrimary)
          .map(c => (
            <Link
              href={c.href}
              className={`button ${btnClass} is-rounded`}
              aria-label={c.id}
              key={c.id}
            >
              <FontAwesomeIcon icon={c.classFontAwesome} fixedWidth />
            </Link>
          ))}
      </div>

      <small>
        Handcrafted with <FontAwesomeIcon icon={faHeart} fixedWidth /> by
        myself. Copyright &copy; {new Date().getFullYear()}.<br />
        Made with{' '}
        <Link href="https://bulma.io/" {...linkProp}>
          <b>Bulma</b>
        </Link>
        {' and '}
        <Link href="https://nextjs.org/" {...linkProp}>
          <b>Next.js</b>
        </Link>
        .<br />
        <br />
        Hosted on{' '}
        <Link href="https://zeit.co/now" {...linkProp}>
          <b>ZEIT Now</b>
        </Link>
        . Source available on{' '}
        <Link href="https://github.com/grikomsn/landing-page" {...linkProp}>
          <b>GitHub</b>
        </Link>
        .
      </small>
    </Container>
  )
}

Footer.propTypes = {
  bgClass: PropTypes.string,
  btnClass: PropTypes.string,
  textClass: PropTypes.string,
}

Footer.defaultProps = {
  bgClass: 'has-background-dark',
  btnClass: 'is-dark',
  textClass: 'has-text-light',
}

export default Footer
