import * as React from "react";

import { Box, Heading, Stack } from "@chakra-ui/core";
import { Card, Showcases } from "@/components";

import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { Showcase } from "@/types";
import { gql } from "@/cms";

type ProjectsPageProps = {
  showcases: Showcase[];
};

export const getStaticProps: GetStaticProps = async () => {
  const { showcases } = await gql`
    {
      showcases: allShowcases {
        title
        tech
        image {
          url
          responsiveImage {
            alt
            aspectRatio
            base64
            bgColor
            height
            sizes
            src
            srcSet
            title
            webpSrcSet
            width
          }
        }
        url
      }
    }
  `;

  return {
    props: {
      showcases,
    },
    revalidate: 86400,
  };
};

const ProjectsPage: React.FC<ProjectsPageProps> = ({ showcases }) => (
  <Box>
    <NextSeo
      title="Projects"
      description="Here are some of my past works from personal projects and open source ones."
    />

    <Card>
      <Stack pb={4}>
        <Heading as="h2">Projects</Heading>
        <Box>
          Here are some of my past works from personal projects and open source
          ones.
        </Box>
      </Stack>

      <Showcases showcases={showcases} />
    </Card>
  </Box>
);

export default ProjectsPage;
