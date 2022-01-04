import "bulma/css/bulma.css";

import * as React from "react";

import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
