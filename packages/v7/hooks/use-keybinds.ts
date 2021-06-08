import { useEffect } from "react";

import siteConfig from "~config/site";

import { NextRouter } from "next/router";
import tinykeys from "tinykeys";

export default function useKeybinds(router: NextRouter) {
  useEffect(() => {
    const unsub = tinykeys(window, {
      "g h": () => router.push("/"),
      "g b": () => router.push("/blog"),
      "g a": () => router.push("/appearances"),
      "g p": () => router.push("/projects"),
      "g m": () => router.push("/about"),
      "g d": () => window.open(siteConfig.dashboardUrl, "_blank"),
    });

    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
