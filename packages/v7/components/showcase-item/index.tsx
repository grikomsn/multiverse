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

interface ShowcaseItemProps {
  data: ShowcaseFragment;
}

const ShowcaseItem: React.FC<ShowcaseItemProps> = (props) => {
  const { data } = props;

  return (
    <LinkBox
      key={data.id as string}
      _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
      bgColor="whiteAlpha.50"
      borderRadius="md"
      boxShadow="sm"
      d="inline-block"
      overflow="hidden"
      pos="relative"
      role="group"
      transitionDuration="fast"
      transitionProperty="common"
      transitionTimingFunction="ease-out"
    >
      <DatoImage
        _groupHover={{ filter: "blur(2px)" }}
        d="block"
        data={data.image.responsiveImage}
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
          href={data.url}
          isExternal
          pb={4}
        >
          {trimHttps(data.url)}
        </LinkOverlay>
        <Wrap d={["none", "flex"]}>
          {data.tags.map((t) => (
            <WrapItem key={t.slug}>
              <Tag size="sm" variant="subtle">
                {t.title}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Stack>
    </LinkBox>
  );
};

export default ShowcaseItem;
