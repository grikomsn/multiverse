import "@fontsource/plus-jakarta-sans/latin.css";
import "@grikomsn/private-fonts/berkeley-mono/index.css";
import "styles/index.css";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { queryClient } from "lib/react-query";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { CentralProvider } from "store/central/provider";
import { MarkdownProvider } from "store/markdown/provider";
import { Layout } from "ui/layout";

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
