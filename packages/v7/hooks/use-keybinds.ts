import { createElement, useEffect } from "react";

import siteConfig from "~config/site";
import { createKeybindsRecord } from "~lib/keybinds";
import { useCheatsheet, useMobileDrawer } from "~store/global";

import { Link, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import tinykeys from "tinykeys";

export default function useKeybinds() {
  const router = useRouter();
  const toast = useToast({
    isClosable: true,
    position: "top-right",
    variant: "subtle",
  });

  const { onToggle: toggleCheatsheet } = useCheatsheet();
  const { onToggle: toggleMobileDrawer } = useMobileDrawer();

  useEffect(() => {
    const unsub = tinykeys(
      window,
      createKeybindsRecord<(event: KeyboardEvent) => void>({
        "g h": () => {
          void router.push("/");
          toast({ title: "Navigating to /" });
        },
        "g b": () => {
          void router.push("/blog");
          toast({ title: "Navigating to /blog" });
        },
        "g a": () => {
          void router.push("/appearances");
          toast({ title: "Navigating to /appearances" });
        },
        "g p": () => {
          void router.push("/projects");
          toast({ title: "Navigating to /projects" });
        },
        "g m": () => {
          void router.push("/about");
          toast({ title: "Navigating to /about" });
        },
        "g d": () => {
          toast({
            title: "Open dashboard?",
            description: createElement(
              Link,
              { href: siteConfig.dashboardUrl, isExternal: true },
              "Click here to open dashboard",
            ),
          });
        },
        "Shift+?": () => {
          toggleCheatsheet();
        },
        "Meta+KeyK": (e) => {
          e.preventDefault();
          toggleMobileDrawer();
        },
      }),
    );

    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
