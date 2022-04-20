import { FaviconsMetaTags } from "__generated__/favicons-meta-tags";
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
          <FaviconsMetaTags />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
