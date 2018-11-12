import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NextLink from './NextLink'
import PropTypes from 'prop-types'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import metadata from '../metadata'

export default class Footer extends Component {
  render() {
    return (
      <footer
        className={`footer ${this.props.bgClass} ${this.props.textClass}`}>
        <div className="container has-text-centered">
          <div className="buttons">
            {metadata.links
              .filter(link => link.isPrimary)
              .map(c => (
                <NextLink
                  href={c.href}
                  target="_blank"
                  className={`button ${this.props.btnClass} is-rounded`}
                  rel="noreferrer"
                  aria-label={c.id}
                  key={c.id}>
                  <FontAwesomeIcon icon={c.classFontAwesome} fixedWidth />
                </NextLink>
              ))}
          </div>
          <small>
            Handcrafted with <FontAwesomeIcon icon={faHeart} fixedWidth /> by
            myself. Copyright &copy; {new Date().getFullYear()}.<br />
            Made with{' '}
            <a
              href="https://bulma.io/"
              target="_blank"
              rel="noreferrer"
              className="has-text-light">
              <b>Bulma</b>
            </a>
            {' and '}
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noreferrer"
              className="has-text-light">
              <b>Next.js</b>
            </a>
            .<br />
            <br />
            Hosted on{' '}
            <a
              href="https://netlify.com"
              target="_blank"
              rel="noreferrer"
              className="has-text-light">
              <b>Netlify</b>
            </a>
            . Source available on{' '}
            <a
              href="https://github.com/grikomsn/landing-page"
              target="_blank"
              rel="noreferrer"
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
  }
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
