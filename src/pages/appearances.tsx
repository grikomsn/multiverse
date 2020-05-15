import { gql } from "@/cms";
import { Appearances, Card } from "@/components";
import { Appearance } from "@/types";
import { Box, Heading, Stack } from "@chakra-ui/core";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import * as React from "react";
import { ResponsiveImageType } from "react-datocms";

type AppearancesPageProps = {
  appearances: Appearance[];
  header: {
    responsiveImage: ResponsiveImageType;
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const { appearances, header } = await gql`
    {
      appearances: allAppearances {
        title
        date
        subtitle
        url
        tags
        category
      }
      header: upload(
        filter: { notes: { matches: { pattern: "appearances-header" } } }
      ) {
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
    }
  `;

  return {
    props: {
      appearances,
      header,
    },
  };
};

const AppearancesPage: React.FC<AppearancesPageProps> = ({
  appearances,
  header,
}) => (
  <Box>
    <NextSeo
      title="Appearances"
      description="Talks, meetups, and other appearances from various events"
    />

    <Card headerResponsiveImage={header.responsiveImage}>
      <Stack>
        <Heading as="h2">Appearances</Heading>
        <Box>Talks, meetups, and other appearances from various events.</Box>
      </Stack>

      <Appearances appearances={appearances} />
    </Card>
  </Box>
);

export default AppearancesPage;
