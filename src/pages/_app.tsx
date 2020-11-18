import "@/stylesheets/html.css";

import * as React from "react";

import { Box, ChakraProvider, Stack } from "@chakra-ui/react";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";

import { AppContextProps } from "@/store/app";
import Footer from "@/components/footer";
import Head from "next/head";
import NProgress from "nprogress";
import Navbar from "@/components/navbar";
import type { AppProps as NextAppProps } from "next/app";
import Router from "next/router";
import dynamic from "next/dynamic";
import siteConfig from "site-config";
import theme from "@/theme";

const MobileDrawer = dynamic(() => import("@/components/mobile-drawer"));

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type AppProps = NextAppProps & AppContextProps;

function App(props: AppProps) {
  const { Component, pageProps, router } = props;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <DefaultSeo
        title="Welcome!"
        titleTemplate={`%s · ${siteConfig.title}`}
        description={siteConfig.description}
        canonical={siteConfig.url + (router.asPath || "")}
        openGraph={{
          title: siteConfig.title,
          description: siteConfig.description,
          type: "website",
          site_name: siteConfig.title,
          images: [
            {
              url: `${siteConfig.url}/social.png`,
              width: 1024,
              height: 512,
              alt: siteConfig.title,
            },
            {
              url: `${siteConfig.url}/social-alt.png`,
              width: 1024,
              height: 512,
              alt: siteConfig.title,
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
          handle: siteConfig.twitterUsername,
          site: siteConfig.twitterUsername,
        }}
      />

      <SocialProfileJsonLd
        type="person"
        name={siteConfig.title}
        url={siteConfig.url}
        sameAs={Object.values(siteConfig.socials)}
      />

      <ChakraProvider resetCSS theme={theme}>
        {/* @ts-expect-error disable layout parameter */}
        {Component.disableLayout ? (
          <Component {...pageProps} />
        ) : (
          <>
            <Stack maxW="6xl" minH="100vh" mx="auto" spacing={0}>
              <Navbar />
              <Box as="main" flexGrow={1}>
                <Component {...pageProps} />
              </Box>
              <Footer />
            </Stack>

            <MobileDrawer />
          </>
        )}
      </ChakraProvider>
    </>
  );
}

export default App;
