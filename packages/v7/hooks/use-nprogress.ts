import { useCallback, useEffect } from "react";

import { useGlobalStore } from "~store/global";

import { useRouter } from "next/router";
import nprogress from "nprogress";

nprogress.configure({
  showSpinner: false,
});

const NPROGRESS_START_DELAY = 500;

export default function useNProgress() {
  const router = useRouter();

  const closeModals = useGlobalStore(
    useCallback((store) => store.closeModals, []),
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    function routeStart() {
      timeout = setTimeout(() => {
        nprogress.start();
      }, NPROGRESS_START_DELAY);
      closeModals();
    }

    function routeDone() {
      clearTimeout(timeout);
      nprogress.done();
    }

    router.events.on("routeChangeStart", routeStart);
    router.events.on("routeChangeComplete", routeDone);
    router.events.on("routeChangeError", routeDone);

    return () => {
      router.events.off("routeChangeStart", routeStart);
      router.events.off("routeChangeComplete", routeDone);
      router.events.off("routeChangeError", routeDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
