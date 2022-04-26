import { useFathom } from "hooks/use-fathom";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useIsFetching } from "react-query";
import { ROUTE_LOADING_TIMEOUT, ROUTE_LOADING_TOAST_ID } from "utils/constants";

export interface CentralProviderProps {
  children: ReactNode;
}

export function CentralProvider({ children }: CentralProviderProps) {
  const isFetching = useIsFetching();

  useEffect(() => {
    if (isFetching) {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        toast.loading("Loading page...", { id: ROUTE_LOADING_TOAST_ID });
      }, ROUTE_LOADING_TIMEOUT);
    } else {
      if (timeout.current) clearTimeout(timeout.current);
      toast.dismiss(ROUTE_LOADING_TOAST_ID);
    }
  }, [isFetching]);

  const router = useRouter();
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function start() {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        toast.loading("Loading page...", { id: ROUTE_LOADING_TOAST_ID });
      }, ROUTE_LOADING_TIMEOUT);
    }
    function end() {
      if (timeout.current) clearTimeout(timeout.current);
      toast.dismiss(ROUTE_LOADING_TOAST_ID);
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

  useFathom();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
