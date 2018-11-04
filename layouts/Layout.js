import '../stylesheets/style.scss'

import React, { Component } from 'react'

import Head from 'next/head'
import PropTypes from 'prop-types'
import metadata from '../metadata'

export default class Layout extends Component {
  render() {
    return (
      <div>
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
          />
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <title>{this.props.pageTitle}</title>
          <link rel="shortcut icon" href="/static/favicon.ico" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/safari-pinned-tab.svg"
            color={this.props.colorHex}
          />
          <meta
            name="apple-mobile-web-app-title"
            content={this.props.pageTitle}
          />
          <meta name="application-name" content={this.props.pageTitle} />
          <meta name="msapplication-TileColor" content={this.props.colorHex} />
          <meta
            name="msapplication-config"
            content="/static/browserconfig.xml"
          />
          <meta name="theme-color" content={this.props.colorHex} />
        </Head>
        {this.props.children}
      </div>
    )
  }
}

Layout.propTypes = {
  colorHex: PropTypes.string,
  pageTitle: PropTypes.string,
}

Layout.defaultProps = {
  colorHex: metadata.colorHex,
  pageTitle: metadata.pageTitle,
}
