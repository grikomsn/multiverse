import App, { Container } from 'next/app'

import { PageTransition } from 'next-page-transitions'
import React from 'react'
import Router from 'next/router'
import withGA from 'next-ga'

class CustomApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <PageTransition timeout={200} classNames="page-transition">
          <Component {...pageProps} />
        </PageTransition>

        <style global jsx>{`
          .page-transition-enter {
            opacity: 0;
          }
          .page-transition-enter-active {
            opacity: 1;
            transition: opacity 200ms;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-exit-active {
            opacity: 0;
            transition: opacity 200ms;
          }
        `}</style>
      </Container>
    )
  }
}

export default withGA('UA-128742601-1', Router)(CustomApp)
