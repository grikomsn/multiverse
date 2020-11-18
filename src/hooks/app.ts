/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import * as copee from "copee";

import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

import EmailTooltip from "@/components/email-tooltip";
import type { IconType } from "react-icons/lib";
import siteConfig from "site-config";
import { useToast } from "@chakra-ui/react";

export function useEmail() {
  const toast = useToast();

  const copyEmail = React.useCallback(() => {
    copee.toClipboard(siteConfig.email);
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
