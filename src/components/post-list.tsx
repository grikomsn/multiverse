import * as React from "react";

import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import type { BlogPost } from "@/generated/graphql";
import NextLink from "next/link";
import format from "date-fns/format";

interface PostListProps {
  posts: BlogPost[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <Box>
      {posts.map((p, i) => (
        <React.Fragment key={p.sys?.id || p.slug}>
          {i > 0 && <Divider />}
          <NextLink href={`/blog/${p.slug}`} passHref>
            <Flex
              alignItems="flex-start"
              as="a"
              borderRadius="md"
              flexDir={{ base: "column", md: "row" }}
              _hover={{ bgColor: "whiteAlpha.100" }}
              mx={-4}
              p={4}
              role="group"
              transition="background-color 150ms ease"
            >
              <Heading
                lineHeight="base"
                pb={2}
                size="sm"
                variant="link"
                w={{ base: null, md: 2 / 5 }}
              >
                {p.title}
              </Heading>
              <Stack px={{ md: 4 }} spacing={4} w={{ base: null, md: 2 / 5 }}>
                <Text>{p.subtitle}</Text>
                <Text color="gray.400">{p.tags.join(", ")}</Text>
              </Stack>
              <Text
                color="gray.400"
                textAlign="right"
                w={{ base: null, md: 1 / 5 }}
              >
                <Box as="span" d={{ md: "none" }}>
                  Posted on{" "}
                </Box>
                {format(new Date(p.postedAt), "MMMM do, Y")}
              </Text>
            </Flex>
          </NextLink>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default PostList;
