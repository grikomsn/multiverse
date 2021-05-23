import * as React from "react";

import { AppearanceFragment } from "~generated/graphql";

import icons from "./icons";

import {
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import trimHttps from "@grikomsn/shared/utils/trim-https";
import format from "date-fns/format";
import Link from "next/link";

interface AppearanceItemProps {
  data: AppearanceFragment;
}

const AppearanceItem: React.FC<AppearanceItemProps> = (props) => {
  const { data } = props;

  return (
    <LinkBox
      _hover={{
        bgColor: "whiteAlpha.200",
        boxShadow: "lg",
        translateY: "-4px",
      }}
      bgColor="whiteAlpha.50"
      borderRadius="md"
      boxShadow="sm"
      role="group"
      transform="auto-gpu"
      transitionDuration="fast"
      transitionProperty="common"
      transitionTimingFunction="ease-out"
    >
      <Stack
        align="center"
        direction={["column", "column", "row"]}
        p={[4, 8]}
        spacing={[4, 8]}
        textAlign={["center", "center", "initial"]}
      >
        <Icon as={icons[data.category]} boxSize={[8, 12]} />
        <Stack>
          <Text color="whiteAlpha.700" fontSize="sm">
            {format(new Date(data.date as string), "PPPP")}
          </Text>
          <Heading size="lg">{data.title}</Heading>
          <Text>{data.subtitle}</Text>
          <LinkOverlay
            color="yellow.200"
            fontSize="sm"
            href={data.url}
            isExternal
            pb={4}
          >
            {trimHttps(data.url)}
          </LinkOverlay>
          <Wrap justify={["center", "center", "initial"]}>
            {data.tags.map((t) => (
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
      </Stack>
    </LinkBox>
  );
};

export default AppearanceItem;
