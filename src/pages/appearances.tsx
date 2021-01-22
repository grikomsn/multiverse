import * as React from "react";

import type { GetStaticProps, NextPage } from "next";

import type { Appearance } from "@/generated/graphql";
import AppearanceList from "@/components/appearance-list";
import { NextSeo } from "next-seo";
import { Stack } from "@chakra-ui/react";
import TitleSeparator from "@/components/title-separator";
import { cms } from "@/lib/cms";
import copywriting from "@/copywriting.json";

interface AppearancesPageProps {
  appearance: Appearance[];
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await cms().appearancesStaticProps();

  return {
    props: {
      appearance: data.appearanceCollection.items,
    },
  };
};

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

export default AppearancesPage;
