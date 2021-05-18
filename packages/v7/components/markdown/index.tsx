import * as React from "react";

import prismTheme from "./prism-theme";

import {
  Box,
  Code,
  Divider,
  Heading,
  Img,
  Link,
  ListItem,
  OrderedList,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import {
  NormalComponents,
  SpecialComponents,
} from "react-markdown/src/ast-to-react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";

type Components = Partial<NormalComponents & SpecialComponents>;

function wrapLinkId(id: unknown, children: React.ReactNode) {
  if (id) {
    return <Link href={`#${id}`}>{children}</Link>;
  }

  return children;
}

export const baseComponents: Components = {
  a({ node, ...rest }) {
    const href = rest.href as string;
    return <Link isExternal={!href.startsWith("#")} variant="link" {...rest} />;
  },

  p({ node, ...rest }) {
    return <Text {...rest} />;
  },
};

export const postComponents: Components = {
  ...baseComponents,

  blockquote({ node, ...rest }) {
    return (
      <Box
        borderLeftColor="whiteAlpha.400"
        borderLeftWidth={2}
        color="whiteAlpha.700"
        pl={4}
        py={2}
        {...rest}
      />
    );
  },

  code({ node, inline, className, children, ...rest }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        children={String(children).replace(/\n$/, "")}
        language={match[1]}
        style={prismTheme}
        {...rest}
      />
    ) : (
      <Code children={children} className={className} {...rest} />
    );
  },
  hr({ node, ...rest }) {
    return (
      <Box py={4}>
        <Divider maxW="lg" mx="auto" {...rest} />
      </Box>
    );
  },
  img({ node, ...rest }) {
    return (
      <Stack align="center" pb={8} textAlign="center">
        <Img mx="auto" {...rest} />
        {rest.alt && (
          <Text color="whiteAlpha.400" fontSize="sm" fontStyle="italic">
            {rest.alt}
          </Text>
        )}
      </Stack>
    );
  },

  h1({ node, id, ...rest }) {
    return wrapLinkId(id, <Heading size="2xl" {...rest} />);
  },
  h2({ node, id, ...rest }) {
    return wrapLinkId(id, <Heading size="xl" {...rest} />);
  },
  h3({ node, id, ...rest }) {
    return wrapLinkId(id, <Heading size="lg" {...rest} />);
  },
  h4({ node, id, ...rest }) {
    return wrapLinkId(id, <Heading size="md" {...rest} />);
  },
  h5({ node, id, ...rest }) {
    return wrapLinkId(id, <Heading size="sm" {...rest} />);
  },
  h6({ node, id, ...rest }) {
    return wrapLinkId(id, <Heading size="xs" {...rest} />);
  },

  ul({ node, ...rest }) {
    return <UnorderedList pl={4} {...rest} />;
  },
  ol({ node, ...rest }) {
    return <OrderedList pl={4} {...rest} />;
  },
  li({ node, ...rest }) {
    return <ListItem {...rest} />;
  },
};
