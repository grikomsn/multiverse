import * as React from "react";

import { WebsiteSeoTagsQuery } from "~generated/graphql";
import DefaultLayout from "~layouts/default";
import emotionCache from "~lib/emotion-cache";
import theme from "~theme";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { AppProps } from "next/app";

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

interface CustomAppProps extends AppProps {
  meta: WebsiteSeoTagsQuery;
}

export default function App(props: CustomAppProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Component, pageProps } = props;

  return (
    <StyleProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </StyleProvider>
  );
}
