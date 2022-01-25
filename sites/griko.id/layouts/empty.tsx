import * as React from "react";

import Head from "next/head";

export default function EmptyLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>

      {children}
    </>
  );
}
