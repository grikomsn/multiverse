import * as React from "react";

import meta from "@/config/meta.json";
import { RegisterFathom } from "@/lib/fathom";
import { KBarAppProvider } from "@/lib/kbar";
import { CheckReferrer } from "@/lib/referrer";
import Footer from "@/ui/footer";
import Header from "@/ui/header";
import PageProgress from "@/ui/page-progress";
import { getAbsoluteUrl } from "@/utils/api";

import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import { Toaster } from "react-hot-toast";

const MobileMenuBar = dynamic(() => import("@/ui/mobile-menu-bar"));

const DEFAULT_OPENGRAPH_IMAGE_URL = `${getAbsoluteUrl().origin}/social.png`;

export default function DefaultLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>

      <CheckReferrer />
      <DefaultAppSeo />
      <RegisterFathom />
      <Toaster position="top-center" />

      <PageProgress />
      <KBarAppProvider>
        <div className="container flex flex-col mx-auto max-w-4xl min-h-screen">
          <Header />

          <main className="relative flex-grow">
            {children}
            {/*  */}
          </main>
          <Footer />
          <MobileMenuBar />
        </div>
      </KBarAppProvider>
    </>
  );
}

export function DefaultAppSeo() {
  const router = useRouter();

  return (
    <DefaultSeo
      canonical={meta.url + (router.asPath || "")}
      defaultTitle={meta.name}
      description={meta.description}
      openGraph={{
        title: meta.name,
        description: meta.description,
        type: "website",
        site_name: meta.name,
        images: [{ url: DEFAULT_OPENGRAPH_IMAGE_URL }],
      }}
      titleTemplate={`%s - ${meta.name}`}
      twitter={{
        cardType: "summary_large_image",
        handle: meta.twitter.username,
        site: meta.twitter.username,
      }}
    />
  );
}
