import "@/stylesheets/html.css";

import * as React from "react";

import {
  Box,
  CSSReset,
  ColorModeProvider,
  Stack,
  ThemeProvider,
} from "@chakra-ui/core";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import { Footer, Navbar } from "@/components";
import NextApp, { AppContext, AppProps } from "next/app";

import Head from "next/head";
import NProgress from "nprogress";
import Router from "next/router";
import { SiteConfig } from "@/types";
import { SiteConfigProvider } from "@/store/site-config";
import { client } from "@/cms";
import { cssResetConfig } from "@/utils/chakra-ui";
import theme from "@/theme";

type CustomAppProps = AppProps & {
  colorMode: "dark" | "light";
  siteConfig: SiteConfig;
};

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps, router, siteConfig }: CustomAppProps) => (
  <SiteConfigProvider value={siteConfig}>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <ThemeProvider theme={theme}>
      <ColorModeProvider value="dark">
        <CSSReset config={cssResetConfig} />

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
            images: [{ url: `${siteConfig.url}/social.png` }],
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
          sameAs={[
            siteConfig.socials["GitHub"],
            siteConfig.socials["Twitch"],
            siteConfig.socials["Twitter"],
          ]}
        />

        <Stack
          fontSize="md"
          m="auto"
          maxW={[, , "2xl", "6xl"]}
          minH="100vh"
          px={{ lg: 8 }}
        >
          <Navbar />
          <Box flexGrow={1}>
            <Component {...pageProps} />
          </Box>
          <Footer />
        </Stack>
      </ColorModeProvider>
    </ThemeProvider>
  </SiteConfigProvider>
);

App.getInitialProps = async (context: AppContext) => {
  const props = NextApp.getInitialProps(context);

  const { siteConfig } = await client.request(/* GraphQL */ `
    {
      siteConfig {
        title
        description
        descriptionMarkdown
        url
        twitterUsername
        email
        links
        socials
      }
    }
  `);

  return { ...props, siteConfig };
};

export default App;
