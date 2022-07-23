import { useLenis } from "hooks/use-lenis";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Footer } from "ui/footer";
import { Navigation } from "ui/navigation";

import { MetaTags } from "./meta-tags";

const BulmaNotifyBar = dynamic(() => import("ui/notify-bar/bulma").then((mod) => mod.BulmaNotifyBar), { ssr: false });
export interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  useLenis();
  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>
      <MetaTags />
      <BulmaNotifyBar />
      <div className="container mx-auto flex max-w-4xl flex-col p-4 motion-safe:animate-fade-in sm:p-8">
        <main key={router.asPath} className="mb-16 min-h-screen flex-grow sm:motion-safe:animate-slide-down-fade">
          {children}
        </main>
        <Footer />
      </div>
      <Navigation />
      <Toaster position="top-center" />
    </>
  );
}
