import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Footer from '../components/Footer'
import Layout from '../layouts/Layout'
import Navbar from '../components/Navbar'
import metadata from '../metadata'

const Socials = () =>
  metadata.links.map(c => (
    <a
      href={c.href}
      target="_blank"
      key={c.id}
      className="column is-one-third socials">
      <div className="box">
        <FontAwesomeIcon
          className="has-text-light"
          icon={c.classFontAwesome}
          size="3x"
          fixedWidth
        />
        <p className="subtitle">
          <small>{c.id}</small>
        </p>
      </div>
      <style jsx>{`
        .box {
          padding: 3rem;
          background-color: ${c.color};
        }
        .socials:hover {
          transform: scale(1.025);
        }
        .subtitle {
          margin: 2rem 0 0;
        }
      `}</style>
    </a>
  ))

export default () => (
  <Layout colorHex="#353535">
    <div className="hero is-dark">
      <div className="hero-head">
        <Navbar />
      </div>
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title">Socials</h1>
          <p className="subtitle">
            I am available (virtually) anywhere on the interwebs.
          </p>
          <br />
          <div className="columns is-centered is-multiline g-max-width">
            <Socials />
          </div>
        </div>
      </div>
    </div>

    <Footer />

    <style jsx>{`
      html,
      body {
        background-color: #353535;
      }
    `}</style>
  </Layout>
)
