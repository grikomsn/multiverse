import "@fontsource/jetbrains-mono/latin.css";
import "@fontsource/lexend/latin.css";
import "@/styles/tailwind.css";

import * as React from "react";

import MarkdownProvider from "@/ui/markdown/provider";
import { useComponentLayout } from "@/utils/layout";

import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const Layout = useComponentLayout(Component);

  return (
    <MarkdownProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MarkdownProvider>
  );
}
