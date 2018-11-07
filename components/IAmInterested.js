import NextLink from './NextLink'
import metadata from '../metadata'

export default () => (
  <div className="content has-text-dark">
    <h1>Interested in working together? Let's talk.</h1>
    <p>
      Contact me via email for business inquiries, or{' '}
      <NextLink href="/socials" className="has-text-link">
        say hello via social medias
      </NextLink>
      .
    </p>
    <br />
    <div className="buttons" style={{ justifyContent: 'center' }}>
      <a
        href={`mailto:${metadata.email}`}
        className="button is-info is-primary">
        <i className="e1a-wave_tone1" /> &nbsp; {metadata.email}
      </a>
      <a href={`mailto:${metadata.emailSecondary}`} className="button is-light">
        <i className="e1a-eyes" /> &nbsp; {metadata.emailSecondary}
      </a>
    </div>
  </div>
)
