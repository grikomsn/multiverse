import * as React from "react";

import type { GetStaticProps, NextPage } from "next";

import { NextSeo } from "next-seo";
import ProjectList from "@/components/project-list";
import type { Showcase } from "@/generated/graphql";
import { Stack } from "@chakra-ui/core";
import TitleSeparator from "@/components/title-separator";
import { contentful } from "@/cms";
import copywriting from "@/copywriting.json";

interface ProjectsPageProps {
  showcase: Showcase[];
}

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

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  const data = await contentful().request(/* GraphQL */ `
    {
      showcaseCollection(order: title_ASC) {
        items {
          title
          tech
          image {
            url(transform: { width: 1280 })
          }
          url
          sys {
            id
          }
        }
      }
    }
  `);

  return {
    props: {
      showcase: data.showcaseCollection.items,
    },
  };
};

export default ProjectsPage;
