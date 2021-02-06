import "@/stylesheets/html.css";

import * as React from "react";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { AppContextProps } from "@/store/app";
import theme from "@/theme";

import type { BoxProps } from "@chakra-ui/react";
import { Box, ChakraProvider, DarkMode, Stack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import type { AppProps as NextAppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import NProgress from "nprogress";
import siteConfig from "site-config";

const MobileDrawer = dynamic(() => import("@/components/mobile-drawer"));

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type AppProps = NextAppProps & AppContextProps;

const MotionBox = motion.custom<BoxProps>(Box);

function App(props: AppProps) {
  const { Component, pageProps, router } = props;

  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      </Head>

      <DefaultSeo
        canonical={siteConfig.url + (router.asPath || "")}
        description={siteConfig.description}
        openGraph={{
          title: siteConfig.title,
          description: siteConfig.description,
          type: "website",
          // eslint-disable-next-line babel/camelcase
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
        title="Welcome!"
        titleTemplate={`%s · ${siteConfig.title}`}
        twitter={{
          cardType: "summary_large_image",
          handle: siteConfig.twitterUsername,
          site: siteConfig.twitterUsername,
        }}
      />

      <SocialProfileJsonLd
        name={siteConfig.title}
        sameAs={Object.values(siteConfig.socials)}
        type="person"
        url={siteConfig.url}
      />

      <ChakraProvider resetCSS theme={theme}>
        {/* @ts-expect-error disable layout parameter */}
        {Component.disableLayout ? (
          <DarkMode>
            <Component {...pageProps} />
          </DarkMode>
        ) : (
          <DarkMode>
            <Stack maxW="6xl" minH="100vh" mx="auto" spacing={0}>
              <Navbar />
              <AnimatePresence exitBeforeEnter>
                <MotionBox
                  key={router.route}
                  animate="enter"
                  as="main"
                  exit="exit"
                  flexGrow={1}
                  initial="initial"
                  variants={{
                    initial: { opacity: 0, y: -80 },
                    enter: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 80 },
                  }}
                >
                  <Component {...pageProps} />
                </MotionBox>
              </AnimatePresence>
              <Footer />
            </Stack>

            <MobileDrawer />
          </DarkMode>
        )}
      </ChakraProvider>
    </>
  );
}

export default App;
