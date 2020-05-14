import { Link, Snippet } from "@/components";
import {
  Box,
  BoxProps,
  Code,
  Divider,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/core";
import * as React from "react";

type RendererRecord = {
  [nodeType: string]: React.ElementType<any>;
};

export const aboutPageRenderer: RendererRecord = {
  link: Link,
  root: (props) => <Stack spacing={4} {...props} />,
  paragraph: Box,
};

export const blogPostRenderer: (_?: boolean) => RendererRecord = (
  isDarkMode,
) => ({
  blockquote: (props) => (
    <Box
      borderLeftColor="gray.500"
      borderLeftWidth={2}
      color={isDarkMode ? "gray.300" : "gray.500"}
      pl={8}
      py={4}
      {...props}
    />
  ),

  code: ({ language, value }) => (
    <Box pb={8}>
      <Snippet code={value} language={language} />
    </Box>
  ),

  heading: ({ level, ...props }) => {
    const sizes = ["2xl", "xl", "lg", "md", "sm", "xs"];
    return <Heading as={`h${level}`} size={sizes[level - 1]} {...props} />;
  },

  html: (props) => {
    const htmlProps: BoxProps = {
      dangerouslySetInnerHTML: { __html: props.value },
      pb: 8,

      ...(/<\/iframe>/.test(props.value) ? { mx: "auto" } : {}),
    };

    return <Box {...htmlProps} />;
  },

  image: (props) => (
    <Image borderRadius={4} mx="auto" maxW="2xl" w="100%" {...props} />
  ),

  inlineCode: Code,

  link: Link,

  paragraph: Box,

  root: (props) => (
    <Stack fontSize={{ md: "lg" }} lineHeight="tall" spacing={8} {...props} />
  ),

  thematicBreak: () => (
    <Box maxW="xs" mx="auto" pb={8} px={8} w="full">
      <Divider />
    </Box>
  ),
});
