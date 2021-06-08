import { useEffect } from "react";

import analyticsConfig from "~config/analytics";
import siteConfig from "~config/site";

import * as Fathom from "fathom-client";
import { NextRouter } from "next/router";

export default function useFathom(router: NextRouter) {
  useEffect(() => {
    Fathom.load(analyticsConfig.fathomSiteId, {
      includedDomains: <string[]>[siteConfig.domain],
    });

    router.events.on("routeChangeComplete", () => {
      Fathom.trackPageview();
    });

    return () => {
      router.events.off("routeChangeComplete", () => {
        Fathom.trackPageview();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
