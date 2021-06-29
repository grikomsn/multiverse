import { useCallback, useEffect } from "react";

import { useGlobalStore } from "~store/global";

import { useRouter } from "next/router";
import nprogress from "nprogress";

nprogress.configure({
  showSpinner: false,
});

export default function useNProgress() {
  const router = useRouter();

  const closeModals = useGlobalStore(
    useCallback((store) => store.closeModals, []),
  );

  useEffect(() => {
    function routeStart() {
      nprogress.start();
      closeModals();
    }

    function routeDone() {
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
