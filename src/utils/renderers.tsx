import * as React from "react";

import {
  Box,
  Link as ChakraLink,
  Code,
  Divider,
  Heading,
  Img,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

import type { BoxProps } from "@chakra-ui/react";
import Snippet from "@/components/snippet";

// https://github.com/rexxars/react-markdown/issues/404#issuecomment-604019030
function slugifyChildren(children: React.ReactNode) {
  const flatten = (text: string, child: any) => {
    return typeof child === "string"
      ? text + child
      : React.Children.toArray(child.props.children).reduce(flatten, text);
  };

  const arrayChildren = React.Children.toArray(children);
  const text = arrayChildren.reduce<string>(flatten, "");
  const slug = text.toLowerCase().replace(/\W/g, "-");

  return slug;
}

function Link({ href, children }) {
  return (
    <ChakraLink href={href} isExternal variant="link">
      {children}
    </ChakraLink>
  );
}

export const baseRenderer = {
  link: Link,

  paragraph: Text,
};

export const kbRenderer = {
  ...baseRenderer,

  heading({ children }) {
    return (
      <Heading pb={2} size="sm">
        {children}
      </Heading>
    );
  },

  list({ children }) {
    return <List>{children}</List>;
  },

  listItem({ children }) {
    return <ListItem>{children}</ListItem>;
  },
};

export const postRenderer = {
  ...baseRenderer,

  blockquote(props) {
    return (
      <Box
        borderLeftColor="gray.500"
        borderLeftWidth={2}
        color="gray.300"
        pl={8}
        py={4}
        {...props}
      />
    );
  },

  code({ language, value }) {
    return (
      <Box pb={8}>
        <Snippet code={value} language={language} />
      </Box>
    );
  },

  heading({ level, children, ...props }) {
    const slug = slugifyChildren(children);
    const sizes = ["2xl", "xl", "lg", "md", "sm", "xs"];

    return (
      <Heading
        as={`h${level}` as "h1"}
        size={sizes[level - 1]}
        id={slug}
        {...props}
      >
        {children}
      </Heading>
    );
  },

  html({ value }) {
    const htmlProps: BoxProps = {
      dangerouslySetInnerHTML: { __html: value },
      pb: 8,

      ...(/<\/iframe>/.test(value) ? { mx: "auto" } : {}),
    };

    return <Box {...htmlProps} />;
  },

  image({ alt, ...props }) {
    return (
      <>
        <Box as="span" pb={4}>
          <Img
            alt={alt}
            borderRadius={4}
            mx="auto"
            maxW="2xl"
            w="100%"
            {...props}
          />
        </Box>
        <Box
          as="span"
          d="inline-block"
          fontSize="sm"
          textAlign="center"
          w="full"
        >
          {alt}
        </Box>
      </>
    );
  },

  inlineCode({ inline: _, ...props }) {
    return <Code d="inline" p={1} {...props} />;
  },

  list(props) {
    return <List styleType="disc" {...props} />;
  },

  listItem: ListItem,

  table(props) {
    return (
      <Box overflow="auto">
        <Box as="table" {...props} />
      </Box>
    );
  },

  tableHead(props) {
    return <Box as="thead" fontWeight="bold" {...props} />;
  },

  tableBody(props) {
    return <Box as="tbody" {...props} />;
  },

  tableRow(props) {
    return <Box as="tr" {...props} />;
  },

  tableCell(props) {
    return <Box as="td" borderWidth={1} p={2} {...props} />;
  },

  thematicBreak() {
    return (
      <Box py={4}>
        <Divider />
      </Box>
    );
  },
};
