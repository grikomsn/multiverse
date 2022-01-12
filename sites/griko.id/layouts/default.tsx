import * as React from "react";

import meta from "@/config/meta.json";
import { RegisterFathom } from "@/lib/fathom";
import { KBarAppProvider } from "@/lib/kbar";
import { CheckReferrer } from "@/lib/referrer";
import Footer from "@/ui/footer";
import Header from "@/ui/header";
import { getAbsoluteUrl } from "@/utils/api";

import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import { Toaster } from "react-hot-toast";

const MobileNavigator = dynamic(() => import("@/ui/mobile-navigator"));

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

      <HeaderGradient />
      <KBarAppProvider>
        <div className="container flex flex-col mx-auto max-w-4xl min-h-screen">
          <Header />

          <main className="flex-grow">
            {children}
            {/*  */}
          </main>
          <Footer />
          <MobileNavigator />
        </div>
      </KBarAppProvider>
      <FooterGradient />
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

function HeaderGradient() {
  return (
    <div className="relative mx-auto max-w-6xl motion-safe:animate-rotate-colors pointer-events-none z-[-2]">
      <div className="absolute inset-x-0 bg-gradient-to-r from-sky-500 via-green-500 to-fuchsia-500 opacity-30 blur-2xl top-[-64px] h-[128px]" />
    </div>
  );
}

function FooterGradient() {
  return (
    <div className="relative mx-auto max-w-6xl motion-safe:animate-rotate-colors pointer-events-none z-[-1]">
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 rounded-t-full opacity-20 blur-2xl h-[32px]" />
    </div>
  );
}
