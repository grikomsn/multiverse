/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";

import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { useClipboard, useToast } from "@chakra-ui/react";

import EmailTooltip from "@/components/email-tooltip";
import type { IconType } from "react-icons/lib";
import siteConfig from "site-config";

export function useEmail() {
  const { onCopy } = useClipboard(siteConfig.email);
  const toast = useToast();

  const copyEmail = React.useCallback(() => {
    onCopy();
    toast({
      title: "Copied!",
      description: "Email copied to clipboard.",
      isClosable: true,
      position: "top",
      status: "success",
    });
  }, []);

  return { copyEmail, EmailTooltip };
}

export function useSocials() {
  const socials: [string, IconType][] = [
    [siteConfig.socials.Discord, FaDiscord],
    [siteConfig.socials.GitHub, FaGithub],
    [siteConfig.socials.Twitter, FaTwitter],
  ];

  return socials;
}
