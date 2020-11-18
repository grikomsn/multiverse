import * as React from "react";

import type { GetStaticProps, NextPage } from "next";

import type { Appearance } from "@/generated/graphql";
import AppearanceList from "@/components/appearance-list";
import { NextSeo } from "next-seo";
import { Stack } from "@chakra-ui/react";
import TitleSeparator from "@/components/title-separator";
import { contentful } from "@/cms";
import copywriting from "@/copywriting.json";

interface AppearancesPageProps {
  appearance: Appearance[];
}

const meta = {
  title: "Appearances",
  description: copywriting.appearances.description,
};

const AppearancesPage: NextPage<AppearancesPageProps> = ({ appearance }) => {
  return (
    <Stack bgColor="gray.700" borderRadius="md" p={8} spacing={4}>
      <NextSeo {...meta} />
      <TitleSeparator {...meta} />
      <AppearanceList appearance={appearance} />
    </Stack>
  );
};

export const getStaticProps: GetStaticProps<AppearancesPageProps> = async () => {
  const data = await contentful().request(/* GraphQL */ `
    {
      appearanceCollection(order: date_DESC) {
        items {
          title
          date
          subtitle
          url
          tags
          category
          sys {
            id
          }
        }
      }
    }
  `);

  return {
    props: {
      appearance: data.appearanceCollection.items,
    },
  };
};

export default AppearancesPage;
