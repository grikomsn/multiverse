import * as React from "react";

import { AppearancesStaticPropsQuery } from "~generated/graphql";
import cms from "~lib/cms";

import {
  Container,
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
import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  FaBolt,
  FaChalkboard,
  FaMicrophone,
  FaRegCommentAlt,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppearancesPageProps {
  data: AppearancesStaticPropsQuery;
}

export const getStaticProps: GetStaticProps<AppearancesPageProps> = async () => {
  const data = await cms().appearancesStaticProps();
  return {
    props: {
      data,
    },
    revalidate: 86400,
  };
};

const pageMeta = {
  title: `Appearances`,
  description: `Talks, meetups, and other appearances from various events.`,
};

const icons: Record<string, IconType> = {
  "lightning-talk": FaBolt,
  podcast: FaMicrophone,
  talk: FaRegCommentAlt,
  workshop: FaChalkboard,
};

const AppearancesPage: NextPage<AppearancesPageProps> = (props) => {
  const { data } = props;
  return (
    <>
      <NextSeo {...pageMeta} />

      <Container maxW="6xl" p={[4, 8]}>
        <Stack align="stretch" spacing={4}>
          <Heading textAlign="center">{pageMeta.title}</Heading>
          <Text pb={8} textAlign="center">
            {pageMeta.description}
          </Text>

          {data.allAppearances.map((a) => (
            <LinkBox
              key={a.id as string}
              _hover={{
                bgColor: "whiteAlpha.200",
                boxShadow: "lg",
                transform: "translateY(-4px)",
              }}
              bgColor="whiteAlpha.50"
              borderRadius="md"
              boxShadow="sm"
              role="group"
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
                <Icon as={icons[a.category]} boxSize={[8, 12]} />
                <Stack>
                  <Text color="whiteAlpha.700" fontSize="sm">
                    {format(new Date(a.date as string), "PPPP")}
                  </Text>
                  <Heading size="lg">{a.title}</Heading>
                  <Text>{a.subtitle}</Text>
                  <LinkOverlay
                    color="yellow.200"
                    fontSize="sm"
                    href={a.url}
                    isExternal
                    pb={4}
                  >
                    {trimHttps(a.url)}
                  </LinkOverlay>
                  <Wrap justify={["center", "center", "initial"]}>
                    {a.tags.map((t) => (
                      <WrapItem key={t.slug}>
                        <Tag size="sm" variant="subtle">
                          {t.title}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Stack>
              </Stack>
            </LinkBox>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default AppearancesPage;
