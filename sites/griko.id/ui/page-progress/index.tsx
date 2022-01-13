import * as React from "react";

import { useRouter } from "next/router";
import toast from "react-hot-toast";

const LOADING_TIMEOUT = 500;
const LOADING_TOAST_KEY = "router-loading";

function showToast() {
  return toast.loading("Loading page...", { id: LOADING_TOAST_KEY });
}

export default function PageProgress() {
  const router = useRouter();

  const timeout = React.useRef<NodeJS.Timeout>();
  React.useEffect(() => {
    function start() {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(showToast, LOADING_TIMEOUT);
    }
    function end() {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      toast.dismiss(LOADING_TOAST_KEY);
    }

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeError", end);
    router.events.on("routeChangeComplete", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeError", end);
      router.events.off("routeChangeComplete", end);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
