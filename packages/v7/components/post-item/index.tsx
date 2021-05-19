import * as React from "react";

import DatoImage from "~components/dato-image";
import { PostMetaFieldsFragment } from "~generated/graphql";

import {
  Box,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import format from "date-fns/format";

interface PostItemProps {
  post: PostMetaFieldsFragment;
}

const PostItem: React.FC<PostItemProps> = (props) => {
  const { post } = props;

  return (
    <LinkBox
      _hover={{
        bgColor: "whiteAlpha.200",
        boxShadow: "lg",
        transform: "translateY(-4px)",
      }}
      bgColor="whiteAlpha.50"
      borderRadius="md"
      boxShadow="sm"
      overflow="hidden"
      role="group"
      transitionDuration="fast"
      transitionProperty="common"
      transitionTimingFunction="ease-out"
      w="full"
    >
      {post.cover && (
        <Box bgColor="whiteAlpha.800">
          <DatoImage data={post.cover.responsiveImage} />
        </Box>
      )}
      <Stack align="center" direction="column" p={[4, 8]}>
        <Text color="whiteAlpha.700" fontSize="sm">
          {format(new Date(post._firstPublishedAt as string), "PPPP")}
        </Text>
        <LinkOverlay href={`/blog/${post.slug}`}>
          <Heading size="lg">{post.title}</Heading>
        </LinkOverlay>
        <Text color="whiteAlpha.600" fontStyle="italic" pb={4}>
          {post.subtitle}
        </Text>
        <Wrap justify="center">
          {post.tags.map((t) => (
            <WrapItem key={t.slug}>
              <Link href={`/tag/${t.slug}`} passHref>
                <Tag as="a" size="sm" variant="subtle">
                  {t.title}
                </Tag>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </Stack>
    </LinkBox>
  );
};

export default PostItem;
