import React, { Component } from 'react'

import Footer from '../components/Footer'
import Layout from '../layouts/Layout'
import Navbar from '../components/Navbar'
import Octokit from '@octokit/rest'

class Container extends Component {
  render() {
    return (
      <Layout colorHex="#209bee">
        <div className="hero is-info">
          <div className="hero-head">
            <Navbar />
          </div>
          <div className="hero-body">{this.props.children}</div>
        </div>
        <Footer
          bgClass="has-background-info"
          btnClass="is-info"
          textClass="has-text-light"
        />
      </Layout>
    )
  }
}

class Repo extends Component {
  render() {
    return (
      <a
        href={this.props.html_url}
        className="box g-repo"
        target="_blank"
        rel="noreferrer">
        <h4 className="title is-4 has-text-dark">{this.props.full_name}</h4>
        <div className="subtitle has-text-dark">
          {this.props.description || <i>No description available</i>}
        </div>
        <small>
          {this.props.stargazers_count} stargazers, {this.props.watchers_count}{' '}
          watchers
        </small>
      </a>
    )
  }
}

export default class extends Component {
  static async getInitialProps() {
    const octo = new Octokit()
    octo.authenticate({
      type: 'token',
      token: process.env.GITHUB_TOKEN,
    })
    const repos = await octo.repos
      .getForUser({ username: 'grikomsn' })
      .then(res => res.data.filter(repo => !repo.fork))

    return {
      repos: repos,
    }
  }

  render() {
    return (
      <Container>
        <div className="container has-text-centered">
          <h1 className="title">Open Source</h1>
          <p className="subtitle">
            Here are my GitHub repos, from project playgrounds to open-source
            projects.
          </p>
          <br />
          <div className="has-text-dark" id="g-repos">
            <div className="has-text-left">
              {this.props.repos.map(repo => (
                <Repo {...repo} key={repo.id} />
              ))}
              <br />
            </div>
            <a
              href="https://github.com/grikomsn?tab=repositories&type=source"
              className="button is-light has-shadow"
              target="_blank"
              rel="noreferrer">
              View more on my GitHub profile
            </a>
          </div>
        </div>
        <style global jsx>{`
          #g-repos {
            max-width: 720px;
            margin: 0 auto;
          }

          .g-repo:hover {
            transform: scale(1.025);
          }
        `}</style>
      </Container>
    )
  }
}
