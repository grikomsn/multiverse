import * as React from "react";

import AppearanceList from "@/components/appearance-list";
import TitleSeparator from "@/components/title-separator";
import copywriting from "@/copywriting.json";
import type { Appearance } from "@/generated/graphql";
import { cms } from "@/lib/cms";

import { Stack } from "@chakra-ui/react";
import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";

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
