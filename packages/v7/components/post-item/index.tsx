import * as React from "react";

import DatoImage from "~components/dato-image";
import { PostMetaFieldsFragment } from "~generated/graphql";

import { Box, Heading, LinkBox, LinkBoxProps, LinkOverlay, Stack, Tag, Text, Wrap, WrapItem } from "@chakra-ui/react";
import format from "date-fns/format";
import Link from "next/link";
import { ResponsiveImageType } from "react-datocms";

interface PostItemProps extends LinkBoxProps {
  href?: string;
  post: PostMetaFieldsFragment;
}

const PostItem = React.forwardRef<null, PostItemProps>(function PostItem(props, ref) {
  const { href, post, ...rest } = props;

  const Wrapper = href ? LinkBox : Box;

  return (
    <Wrapper
      _hover={{
        bgColor: "whiteAlpha.200",
        boxShadow: "lg",
        translateY: "-4px",
      }}
      bgColor="whiteAlpha.50"
      borderRadius="md"
      boxShadow="sm"
      overflow="hidden"
      role="group"
      transform="auto-gpu"
      transitionDuration="fast"
      transitionProperty="common"
      transitionTimingFunction="ease-out"
      w="full"
      {...rest}
      ref={ref}
    >
      {post.cover && (
        <Box bgColor="whiteAlpha.800" maxH={["3xs", "2xs"]} overflow="hidden">
          <DatoImage data={post.cover.responsiveImage as ResponsiveImageType} />
        </Box>
      )}
      <Stack align="center" direction="column" p={[4, 8]}>
        <Text color="whiteAlpha.700" fontSize="sm">
          {format(new Date(post._publishedAt as string), "PPPP")}
        </Text>
        {href ? (
          <LinkOverlay href={href}>
            <Heading size="lg">{post.title}</Heading>
          </LinkOverlay>
        ) : (
          <Heading size="lg">{post.title}</Heading>
        )}
        <Text color="whiteAlpha.600" fontStyle="italic" pb={4}>
          {post.subtitle}
        </Text>
        <Wrap justify="center">
          {post.tags.map((t) => (
            <WrapItem key={t.slug}>
              <Link href={`/tag/${t.slug as string}`} passHref>
                <Tag as="a" size="sm" variant="subtle">
                  {t.title}
                </Tag>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </Stack>
    </Wrapper>
  );
});

export default PostItem;
