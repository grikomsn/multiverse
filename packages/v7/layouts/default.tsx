import * as React from "react";

import Footer from "~components/footer";
import KeybindsCheatsheet from "~components/keybinds-cheatsheet/lazy";
import MobileDrawer from "~components/mobile-drawer/lazy";
import MotionBox from "~components/motion/box";
import Navbar from "~components/navbar";
import siteConfig from "~config/site";
import meta from "~generated/meta.json";
import useKeybinds from "~hooks/use-keybinds";
import useNProgress from "~hooks/use-nprogress";
import { useCheatsheetSyncSetup } from "~store/global";

import { Flex } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import { OpenGraphImages } from "next-seo/lib/types";

const PAGE_TRANSITION_PROPS = {
  animate: "enter",
  exit: "exit",
  initial: "initial",
  variants: {
    initial: { opacity: 0 },
    enter: { duration: 0.2, opacity: 1 },
    exit: { duration: 0.1, opacity: 0 },
  },
};

const Effects: React.FC = () => {
  useCheatsheetSyncSetup();
  useKeybinds();
  useNProgress();

  return null;
};

const DefaultLayout: React.FC = (props) => {
  const { children } = props;

  const router = useRouter();

  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        {meta.site.favicon.map((f, key) =>
          React.createElement(f.tag, { key, ...f.attributes }, null),
        )}
      </Head>

      <DefaultSeo
        canonical={siteConfig.siteUrl + (router.asPath || "")}
        defaultTitle={meta.site.seo.fallback.title}
        description={meta.site.seo.fallback.description}
        openGraph={{
          type: "website",
          site_name: meta.site.seo.siteName,
          images: [meta.site.seo.fallback.image as OpenGraphImages],
        }}
        twitter={{
          cardType: meta.site.seo.fallback.twitterCard,
          handle: meta.site.seo.twitterAccount,
          site: meta.site.seo.twitterAccount,
        }}
      />

      <SocialProfileJsonLd
        name={meta.site.seo.siteName}
        sameAs={Object.values(meta.about.socialsJson)}
        type="person"
        url={siteConfig.siteUrl}
      />

      <Flex flexDir="column" minH="100vh">
        <Navbar />
        <AnimatePresence exitBeforeEnter>
          <MotionBox
            key={router.asPath}
            flexGrow={1}
            {...PAGE_TRANSITION_PROPS}
          >
            {children}
          </MotionBox>
        </AnimatePresence>
        <Footer />
        <MobileDrawer />
        <KeybindsCheatsheet />
      </Flex>

      <Effects />
    </>
  );
};

export default DefaultLayout;
