import * as React from "react";

import { WebsiteSeoTagsQuery } from "~generated/graphql";
import DefaultLayout from "~layouts/default";
import cms from "~lib/cms";
import emotionCache from "~lib/emotion-cache";
import { MetaContext } from "~store/meta";
import theme from "~theme";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import NextApp, { AppContext, AppProps } from "next/app";

const StyleProvider: React.FC = (props) => {
  const { children } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider resetCSS theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
};

interface ProvidersProps {
  value: {
    meta: WebsiteSeoTagsQuery;
  };
}

const AppProviders: React.FC<ProvidersProps> = (props) => {
  const { value, children } = props;

  return (
    <MetaContext.Provider value={value.meta}>
      {/*  */}
      {children}
    </MetaContext.Provider>
  );
};

interface CustomAppProps extends AppProps {
  meta: WebsiteSeoTagsQuery;
}

export default function App(props: CustomAppProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Component, pageProps, meta } = props;

  return (
    <StyleProvider>
      <AppProviders value={{ meta }}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </AppProviders>
    </StyleProvider>
  );
}

App.getInitialProps = async (ctx: AppContext) => {
  const props = NextApp.getInitialProps(ctx);
  const meta = await cms().websiteSeoTags();

  return { ...props, meta };
};
