import * as React from "react";

import meta from "@/config/meta.cjs";

import * as Fathom from "fathom-client";
import { useRouter } from "next/router";

function trackPageview() {
  Fathom.trackPageview();
}

export function RegisterFathom() {
  const router = useRouter();

  React.useEffect(() => {
    if (process.env.NODE_ENV != "development") {
      Fathom.load(meta.fathom.id, {
        includedDomains: [meta.domain],
        url: meta.fathom.scriptUrl,
      });

      router.events.on("routeChangeComplete", trackPageview);
      return () => {
        router.events.off("routeChangeComplete", trackPageview);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
