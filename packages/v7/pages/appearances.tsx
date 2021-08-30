import * as React from "react";

import AppearanceItem from "~components/appearance-item";
import { AppearancesStaticPropsQuery } from "~generated/graphql";
import cms from "~lib/cms";

import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "@grikomsn/shared/types/next";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";

interface AppearancesPageProps {
  data: AppearancesStaticPropsQuery;
}

export const getStaticProps: GetStaticProps<AppearancesPageProps> = async () => {
  const data = await cms().appearancesStaticProps();
  return {
    props: {
      data,
    },
  };
};

const pageMeta = {
  title: `Appearances`,
  description: `Talks, meetups, and other appearances from various events.`,
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
            <AppearanceItem key={a.id as string} data={a} />
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default AppearancesPage;
