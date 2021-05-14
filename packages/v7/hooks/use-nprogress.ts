import { useEffect } from "react";

import { NextRouter } from "next/router";
import nprogress from "nprogress";

export default function useNProgress(router: NextRouter) {
  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      nprogress.start();
    });
    router.events.on("routeChangeComplete", () => {
      nprogress.done();
    });
    router.events.on("routeChangeError", () => {
      nprogress.done();
    });

    return () => {
      router.events.off("routeChangeStart", () => {
        nprogress.start();
      });
      router.events.off("routeChangeComplete", () => {
        nprogress.done();
      });
      router.events.off("routeChangeError", () => {
        nprogress.done();
      });
    };
  }, []);

  return null;
}
