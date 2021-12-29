import * as React from "react";

import Head from "next/head";

export type EmptyLayoutProps = React.PropsWithChildren<{
  //
}>;

export default function EmptyLayout({ children }: EmptyLayoutProps) {
  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>

      {children}
    </>
  );
}
