import '../styles/index.scss'

import { AnimatePresence } from 'framer-motion'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/app'
import React from 'react'

import Layout from '../components/layout'
import config from '../site-config'
import { AppProvider } from '../store/app'

function App({ Component, pageProps, router }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <DefaultSeo
          title="Home"
          titleTemplate="%s • Griko Nibras"
          canonical={config.url + (router.pathname || '')}
          openGraph={{
            title: config.title,
            description: config.description,
            type: 'website',
            site_name: config.title,
            images: [{ url: `${config.url}/social.png` }],
          }}
          twitter={{
            cardType: 'summary_large_image',
            handle: config.social.twitter,
            site: config.social.twitter,
          }}
        />

        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} key={router.asPath} />
        </AnimatePresence>
      </Layout>
    </AppProvider>
  )
}

export default App
