import "../stylesheets/html.css";

import { gql } from "@/cms";
import { Footer, Navbar } from "@/components";
import { SiteConfigProvider } from "@/store/site-config";
import theme from "@/theme";
import { SiteConfig } from "@/types";
import { cssResetConfig } from "@/utils/chakra-ui";
import {
  Box,
  ColorModeProvider,
  CSSReset,
  Stack,
  ThemeProvider,
} from "@chakra-ui/core";
import cookies from "next-cookies";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import NextApp, { AppContext, AppProps } from "next/app";
import * as React from "react";

type CustomAppProps = AppProps & {
  colorMode: "dark" | "light";
  siteConfig: SiteConfig;
};

const App = ({
  Component,
  pageProps,
  router,
  colorMode,
  siteConfig,
}: CustomAppProps) => (
  <SiteConfigProvider value={siteConfig}>
    <ThemeProvider theme={theme}>
      <ColorModeProvider value={colorMode}>
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
  const { colorMode = "dark" } = cookies(context.ctx);

  const { siteConfig } = await gql`
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
  `;

  return { ...props, colorMode, siteConfig };
};

export default App;
