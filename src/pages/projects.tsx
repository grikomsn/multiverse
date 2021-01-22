import * as React from "react";

import type { GetStaticProps, NextPage } from "next";

import { NextSeo } from "next-seo";
import ProjectList from "@/components/project-list";
import type { Showcase } from "@/generated/graphql";
import { Stack } from "@chakra-ui/react";
import TitleSeparator from "@/components/title-separator";
import { cms } from "@/lib/cms";
import copywriting from "@/copywriting.json";

interface ProjectsPageProps {
  showcase: Showcase[];
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await cms().projectsStaticProps();

  return {
    props: {
      showcase: data.showcaseCollection.items,
    },
  };
};

const meta = {
  title: "Projects",
  description: copywriting.projects.description,
};

const ProjectsPage: NextPage<ProjectsPageProps> = ({ showcase }) => {
  return (
    <Stack bgColor="gray.700" borderRadius="md" p={8} spacing={4}>
      <NextSeo {...meta} />
      <TitleSeparator {...meta} />
      <ProjectList showcase={showcase} />
    </Stack>
  );
};

export default ProjectsPage;
