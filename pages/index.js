import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Footer from '../components/Footer'
import Layout from '../layouts/Layout'
import Navbar from '../components/Navbar'
import NextLink from '../components/NextLink'
import Spring from '../components/Spring'
import { faTerminal } from '@fortawesome/free-solid-svg-icons'
import metadata from '../metadata'

class SectionFirst extends Component {
  render() {
    return (
      <div className="has-background-warning">
        <section className="section">
          <div className="container">
            <div id="avatar" />
            <div className="card g-max-width">
              <div className="card-content has-text-centered">
                {this.props.children}
              </div>
            </div>
          </div>
        </section>
        <div className="has-background-dark" id="g-section-separator" />
        <style jsx>{`
          #avatar {
            position: relative;
            z-index: 100;
            margin: 0 auto -96px;
            width: 192px;
            height: 192px;
            background-image: url('https://www.gravatar.com/avatar/c0f719f012e74ffaec3a8e4f7b854689?s=1024');
            background-size: cover;
            border: 3px white solid;
            border-radius: 100%;
          }
          .card {
            padding-top: calc(96px + 2rem);
          }
          .container {
            padding: 0.4rem 0.4rem 0;
          }
          #g-section-separator {
            margin-top: calc(7px - 8rem);
            height: 4rem;
          }
        `}</style>
      </div>
    )
  }
}

const Skillsets = () => (
  <div>
    <div className="columns content">
      <div className="column">
        <i className="e1a-paintbrush e1a-lg" />
        <i className="e1a-man_artist_tone1 e1a-lg" />
        <i className="e1a-crayon e1a-lg" />
        <h3>Front-end Developer</h3>
        <p>I design responsive and friendly user interfaces.</p>
      </div>
      <div className="column">
        <i className="e1a-keyboard e1a-lg" />
        <i className="e1a-man_technologist_tone1 e1a-lg" />
        <i className="e1a-mouse_three_button e1a-lg" />
        <h3>Back-end Developer</h3>
        <p>I develop website logics and information systems.</p>
      </div>
    </div>
    <br />
    <div className="columns content">
      <div className="column">
        <h6>Known languages</h6>
        <ul className="list-unstyled">
          <li>CSS3</li>
          <li>HTML</li>
          <li>Java</li>
          <li>JavaScript</li>
          <li>PHP</li>
        </ul>
      </div>
      <div className="column">
        <h6>Primary weapons</h6>
        <ul className="list-unstyled">
          <li>GitHub / GitLab</li>
          <li>GitKraken</li>
          <li>Hyper</li>
          <li>Insomnia</li>
          <li>PhpStorm</li>
          <li>Visual Studio Code</li>
        </ul>
      </div>
      <div className="column">
        <h6>Things I'm good at</h6>
        <ul className="list-unstyled">
          <li>Docker</li>
          <li>Hibernate ORM</li>
          <li>Laravel</li>
          <li>Next.js</li>
          <li>Vue.js</li>
        </ul>
      </div>
    </div>
  </div>
)

class SectionSecond extends Component {
  render() {
    return (
      <div>
        <section className="section has-background-dark">
          <div className="container">
            <div className="card is-shadowless g-max-width">
              <div className="card-content has-text-centered has-text-light">
                {this.props.children}
              </div>
            </div>
          </div>
        </section>
        <style jsx>{`
          .card {
            background: transparent;
          }
          .container {
            padding: 0 0.4rem;
          }
          .section {
            padding-bottom: 0;
          }
        `}</style>
      </div>
    )
  }
}

class SectionThird extends Component {
  render() {
    return (
      <div>
        <section className="section has-background-dark">
          <div className="container">
            <div className="card g-max-width">
              <div className="card-content has-text-centered">
                {this.props.children}
              </div>
            </div>
          </div>
        </section>
        <style jsx>{`
          .card-content {
            padding: 4rem 0;
          }
          .container {
            padding: 0 0.4rem;
          }
          .section {
            padding-top: 0;
          }
        `}</style>
      </div>
    )
  }
}

export default () => (
  <Layout>
    <div className="hero is-fullheight is-warning">
      <div className="hero-head">
        <Navbar />
      </div>
      <div className="hero-body">
        <div className="container has-text-centered">
          <Spring />
          <div className="subtitle">
            Hello there! I'm a software developer from Surabaya, ID.
          </div>
        </div>
      </div>
    </div>

    <SectionFirst>
      <div className="content">
        <h1>
          Converting coffee <i className="e1a-coffee" /> to code{' '}
          <FontAwesomeIcon icon={faTerminal} /> since 2014
        </h1>
        <p style={{ maxWidth: '800px', margin: '0 auto' }}>
          I started to learn programming when entering college. Since then, I've
          done various freelance projects and collaborate with other skillful
          people to create and develop websites and information systems.
        </p>
      </div>
      <hr />
      <Skillsets />
      <hr />
      <div className="content">
        <h1>
          Recent works <i className="e1a-lollipop" />
        </h1>
        <p>
          Here and the current and past projects, you can{' '}
          <a href={`mailto:${metadata.email}`}>
            request via email for the full list.
          </a>
        </p>
      </div>
      <br />
      <div className="columns">
        <div className="column">
          <div className="card">
            <div className="card-image">
              <figure className="image">
                <img src="/static/g-works-inforlabs.png" alt="Inforlabs" />
              </figure>
            </div>
            <div className="card-content">
              <h4 className="title is-4">Inforlabs Website</h4>
              <p className="subtitle is-6">
                Institut Teknologi Adhi Tama Surabaya
              </p>
              <p>
                Currently live and still in development, Inforlabs allows
                assistant labs and participants from all Informatics
                laboratories to register and manage subject practicums.
              </p>
            </div>
            <div className="card-footer">
              <a
                href="https://inforlabs.net"
                className="card-footer-item"
                target="_blank">
                inforlabs.net
              </a>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card">
            <div className="card-image">
              <figure className="image">
                <img
                  src="/static/g-works-rotten-reviews.png"
                  alt="Rotten Reviews"
                />
              </figure>
            </div>
            <div className="card-content">
              <h4 className="title is-4">Rotten Reviews</h4>
              <p className="subtitle is-6">Personal open-source project</p>
              <p>
                Rotten Reviews is a Node.js package that scrapes movie and TV
                show audience reviews from Rotten Tomatoes. Also maintained by{' '}
                <a href="https://github.com/vimark1">Filype Pereira</a> and{' '}
                <a href="https://github.com/jbbn">Joao Bueno</a>.
              </p>
            </div>
            <div className="card-footer">
              <a
                href="https://github.com/grikomsn/rotten-reviews"
                className="card-footer-item"
                target="_blank">
                grikomsn/rotten-reviews
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionFirst>

    <SectionSecond>
      <div className="content">
        <h1 className="has-text-light">
          Shameless plug <i className="e1a-electric_plug" />
        </h1>
        <p>Here are the things I do on my spare time.</p>
      </div>
      <br />
      <div className="columns">
        <div className="column">
          <div className="card">
            <div className="card-image">
              <figure className="image">
                <img
                  src="/static/g-plugs-articles.jpg"
                  alt="Development Articles"
                />
              </figure>
            </div>
            <div className="card-content">
              <h4 className="title is-4">Development Articles</h4>
              <p className="subtitle is-6">
                Writing dev stuff on dev.to or Medium
              </p>
              <p>
                From writing tutorials to sharing my thoughts on a specific
                topic, I sometimes write on dev.to or Medium. Not my forte, but
                I do try to increase my writing skills.
              </p>
            </div>
            <div className="card-footer">
              <a
                href="https://dev.to/grikomsn"
                className="card-footer-item"
                target="_blank">
                dev.to
              </a>
              <a
                href="https://medium.com/@griko"
                className="card-footer-item"
                target="_blank">
                Medium
              </a>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card">
            <div className="card-image">
              <figure className="image">
                <img
                  src="/static/g-plugs-wallpaper.png"
                  alt="Gadget Wallpapers"
                />
              </figure>
            </div>
            <div className="card-content">
              <h4 className="title is-4">Gadget Wallpapers</h4>
              <p className="subtitle is-6">Creating minimalist backgrounds</p>
              <p>
                I started making wallpapers as a hobby since 2012 and publish
                them on DeviantArt. Nowadays it's just for killing time or when
                I'm on the mood.
              </p>
            </div>
            <div className="card-footer">
              <a
                href="https://grikomsn.deviantart.com/gallery/66550103/Wallpapers"
                className="card-footer-item"
                target="_blank">
                DeviantArt Gallery
              </a>
            </div>
          </div>
        </div>
      </div>
      <br />
    </SectionSecond>

    <SectionThird>
      <div className="content">
        <h1>Interested in working together? Let's talk.</h1>
        <p>
          Contact me via email for business inquiries, or{' '}
          <NextLink href="/socials">say hello via social medias</NextLink>.
        </p>
        <br />
        <div className="buttons" style={{ justifyContent: 'center' }}>
          <a
            href={`mailto:${metadata.email}`}
            className="button is-info is-outlined">
            <i className="e1a-wave_tone1" /> &nbsp; {metadata.email}
          </a>
          <a
            href={`mailto:${metadata.emailSecondary}`}
            className="button is-warning is-outlined">
            <i className="e1a-eyes" /> &nbsp; {metadata.emailSecondary}
          </a>
        </div>
      </div>
    </SectionThird>

    <Footer />

    <style global jsx>{`
      html,
      body {
        background-color: var(--color-warning);
      }
      hr {
        margin: 3rem 0;
      }
      section.section {
        padding-left: 0;
        padding-right: 0;
      }
      ul.list-unstyled {
        display: inline;
        list-style: none;
        margin: 0;
      }
      .card {
        border-radius: 4px;
        height: 100%;
      }
      .card-image,
      .image > img {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
    `}</style>
  </Layout>
)
