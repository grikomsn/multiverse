import * as React from "react";

import analyticsConfig from "~config/analytics";

import { ColorModeScript } from "@chakra-ui/react";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import Script from "next/script";

export default class CustomDocument extends Document {
  fonts = [
    "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap",
    "https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&display=swap",
  ];

  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta content="ie=edge" httpEquiv="X-UA-Compatible" />

          <link href="https://fonts.gstatic.com" rel="preconnect" />
          {this.fonts.map((font) => (
            <link key={font} href={font} rel="stylesheet" />
          ))}
        </Head>

        <body>
          <ColorModeScript initialColorMode="dark" />
          <Main />
          <NextScript />

          <Script
            data-cf-beacon={`{"token": "${analyticsConfig.cloudflareBeaconToken}"}`}
            src="https://static.cloudflareinsights.com/beacon.min.js"
          />
        </body>
      </Html>
    );
  }
}
