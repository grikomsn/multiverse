import * as React from "react";

import FaviconMetaTags from "@/__generated__/favicon-meta-tags";

import NextDocument, { Head, Html, Main, NextScript } from "next/document";

export default class CustomDocument extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
          <link crossOrigin="" href="https://berkeley-mono.griko.id" rel="preconnect" />
          <link href="https://berkeley-mono.griko.id/index.css" rel="stylesheet" />
          <FaviconMetaTags />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
