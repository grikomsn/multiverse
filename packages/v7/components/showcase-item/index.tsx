import * as React from "react";

import DatoImage from "~components/dato-image";
import { ShowcaseFragment } from "~generated/graphql";

import {
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import trimHttps from "@grikomsn/shared/utils/trim-https";
import Link from "next/link";
import { ResponsiveImageType } from "react-datocms";

interface ShowcaseItemProps {
  data: ShowcaseFragment;
}

const ShowcaseItem: React.FC<ShowcaseItemProps> = (props) => {
  const { data } = props;

  return (
    <LinkBox
      key={data.id as string}
      _hover={{ boxShadow: "lg", translateY: "-4px" }}
      bgColor="whiteAlpha.50"
      borderRadius="md"
      boxShadow="sm"
      d="inline-block"
      overflow="hidden"
      pos="relative"
      role="group"
      transform="auto-gpu"
      transitionDuration="fast"
      transitionProperty="common"
      transitionTimingFunction="ease-out"
    >
      <DatoImage
        _groupHover={{ filter: "blur(2px)" }}
        d="block"
        data={data.image?.responsiveImage as ResponsiveImageType}
        transitionDuration="normal"
        transitionProperty="common"
        transitionTimingFunction="ease-out"
      />

      <Stack
        _groupHover={{ opacity: 1 }}
        align="center"
        bgColor="blackAlpha.700"
        inset={0}
        justify="center"
        opacity={0}
        pos="absolute"
        px={8}
        py={4}
        transitionDuration="normal"
        transitionProperty="common"
        transitionTimingFunction="ease-out"
      >
        <Heading size="lg">{data.title}</Heading>
        <Text fontSize={["xs", "sm"]}>{data.subtitle}</Text>
        <LinkOverlay
          color="yellow.200"
          fontSize={["xs", "sm"]}
          href={data.url as string}
          isExternal
          pb={4}
        >
          {trimHttps(data.url as string)}
        </LinkOverlay>
        <Wrap justify="center">
          {data.tags.map((t) => (
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
    </LinkBox>
  );
};

export default ShowcaseItem;
