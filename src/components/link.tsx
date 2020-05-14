import { useColorMode } from "@/hooks";
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/core";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import * as React from "react";
import { UrlObject } from "url";

type LinkProps = ChakraLinkProps & {
  isNextLink?: boolean;
  linkAs?: string | UrlObject;
  nextProps?: Omit<NextLinkProps, "as">;
};

const Link: React.FC<LinkProps> = ({
  href,
  isNextLink,
  linkAs,
  nextProps,
  children,
  ...props
}) => {
  const { isDarkMode } = useColorMode();

  const mergedProps: ChakraLinkProps = {
    ...props,
    color: props.color || (isDarkMode ? "yellow.300" : "yellow.700"),
    children: children || href.replace(/^https?:(\/\/)?/g, ""),
  };

  if (isNextLink) {
    return (
      <NextLink href={href} as={linkAs} passHref {...nextProps}>
        <ChakraLink {...mergedProps} />
      </NextLink>
    );
  }

  return <ChakraLink href={href} isExternal {...mergedProps} />;
};

Link.defaultProps = {
  isNextLink: false,
};

export default Link;
