import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import Link from '../components/ExternalLink'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Layout from '../layouts/Layout'
import metadata from '../metadata'

const SocialLink = styled(Link)`
  &:hover {
    transform: scale(1.025);
  }
`

const Box = styled.div`
  padding: 3rem;
  background-color: ${({ backgroundColor }) => backgroundColor};

  & > .subtitle {
    margin: 2rem 0 0;
  }
`

const Entries = () =>
  metadata.links.map(c => (
    <SocialLink
      href={c.href}
      key={c.id}
      aria-label={c.id}
      className="column is-one-third"
    >
      <Box backgroundColor={c.color} className="box">
        <FontAwesomeIcon
          className="has-text-light"
          icon={c.classFontAwesome}
          size="3x"
          fixedWidth
        />

        <p className="subtitle">
          <small>{c.id}</small>
        </p>
      </Box>
    </SocialLink>
  ))

const Socials = () => (
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
            <Entries />
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </Layout>
)

export default Socials
