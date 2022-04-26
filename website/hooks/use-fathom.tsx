import metadata from "config/metadata";
import { Fathom } from "lib/fathom";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useFathom() {
  const router = useRouter();

  useEffect(() => {
    const track = () => Fathom.trackPageview();
    if (__PROD__) {
      Fathom.load(metadata.fathom.id, {
        includedDomains: [metadata.domain],
        url: metadata.fathom.scriptUrl,
      });
      router.events.on("routeChangeComplete", track);
      return () => {
        router.events.off("routeChangeComplete", track);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
