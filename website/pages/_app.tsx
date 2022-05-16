import "@fontsource/plus-jakarta-sans/latin.css";
import "@grikomsn/private-fonts/berkeley-mono/index.css";
import "styles/index.css";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { queryClient } from "lib/react-query";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { QueryClientProvider } from "react-query";
import { CentralProvider } from "store/central/provider";
import { MarkdownProvider } from "store/markdown/provider";
import { Layout } from "ui/layout";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const ENDPOINT = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;
  if (!ENDPOINT) return;

  const body = JSON.stringify({ route: window.__NEXT_DATA__.page, ...metric });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, body);
  } else {
    void fetch(ENDPOINT, { body, method: "POST", keepalive: true });
  }
}

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CentralProvider>
        <TooltipProvider>
          <MarkdownProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MarkdownProvider>
        </TooltipProvider>
      </CentralProvider>
    </QueryClientProvider>
  );
}
