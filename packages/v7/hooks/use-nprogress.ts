import { useEffect } from "react";

import { useRouter } from "next/router";
import nprogress from "nprogress";

export default function useNProgress() {
  const router = useRouter();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
