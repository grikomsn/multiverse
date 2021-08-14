import * as React from "react";

import AdaptiveTooltip from "~components/adaptive-tooltip";

import prismTheme from "./prism-theme";

import {
  Box,
  Code,
  Divider,
  Heading,
  Icon,
  IconButton,
  Img,
  Link,
  ListItem,
  OrderedList,
  Stack,
  Text,
  UnorderedList,
  useClipboard,
} from "@chakra-ui/react";
import { FaCheck, FaCopy } from "react-icons/fa";
import {
  NormalComponents,
  SpecialComponents,
} from "react-markdown/src/ast-to-react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";

type Components = Partial<NormalComponents & SpecialComponents>;

function wrapLinkId(id: unknown, children: React.ReactNode) {
  if (id) {
    return <Link href={`#${id as string}`}>{children}</Link>;
  }

  return children;
}

export const baseComponents: Components = {
  a({ node, ...rest }) {
    const href = rest.href as string;
    return <Link isExternal={!href.startsWith("#")} variant="link" {...rest} />;
  },

  p({ node, ...rest }) {
    return <Text as="div" fontSize={["sm", "md"]} {...rest} />;
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
        fontSize={["sm", "md"]}
        pl={4}
        py={2}
        {...rest}
      />
    );
  },

  code({ node, inline, className, children, ...rest }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const source = React.useMemo(
      () => String(children).replace(/\n$/, ""),
      [children],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { hasCopied, onCopy } = useClipboard(source);

    const match = /language-(\w+)/.exec(className ?? "");

    return !inline && match ? (
      <Box fontSize={["xs", "sm"]} pos="relative">
        <AdaptiveTooltip
          closeOnClick={false}
          hasArrow
          label={hasCopied ? "Snippet copied!" : "Copy snippet"}
          placement="left"
        >
          <IconButton
            _hover={{ opacity: 1 }}
            aria-label="Copy snippet"
            icon={<Icon as={hasCopied ? FaCheck : FaCopy} />}
            onClick={onCopy}
            opacity={0.5}
            pos="absolute"
            right={2}
            size="sm"
            top={2}
            variant="ghost"
          />
        </AdaptiveTooltip>
        <SyntaxHighlighter language={match[1]} style={prismTheme} {...rest}>
          {source}
        </SyntaxHighlighter>
      </Box>
    ) : (
      <Code className={className} fontSize={["sm", "md"]} {...rest}>
        {source}
      </Code>
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
            {rest.alt as string}
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

  ul({ node, ordered, ...rest }) {
    return <UnorderedList pl={4} {...rest} />;
  },
  ol({ node, ordered, ...rest }) {
    return <OrderedList pl={4} {...rest} />;
  },
  li({ node, ordered, ...rest }) {
    return <ListItem fontSize={["sm", "md"]} {...rest} />;
  },
};
