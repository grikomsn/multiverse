import * as React from "react";

import { RegisterFathom } from "@/lib/fathom";
import PageProgress from "@/ui/page-progress";

import { DefaultAppSeo } from "./default";

import Head from "next/head";
import { Toaster } from "react-hot-toast";

export default function EmptyLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>

      <DefaultAppSeo />
      <RegisterFathom />
      <Toaster position="top-center" />

      <PageProgress />

      {children}
    </>
  );
}
