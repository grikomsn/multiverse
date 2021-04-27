import * as React from "react";

import DatoImage from "~components/dato-image";
import { ProjectsStaticPropsQuery } from "~generated/graphql";
import cms from "~lib/cms";

import {
  Container,
  Heading,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import trimHttps from "@grikomsn/shared/utils/trim-https";
import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";

interface ProjectsPageProps {
  data: ProjectsStaticPropsQuery;
}

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  const data = await cms().projectsStaticProps();
  return {
    props: {
      data,
    },
    revalidate: 86400,
  };
};

const pageMeta = {
  title: `Creations and projects`,
  description: `Here are some of my past works from personal projects and open source ones.`,
};

const ProjectsPage: NextPage<ProjectsPageProps> = (props) => {
  const { data } = props;

  return (
    <>
      <NextSeo {...pageMeta} />

      <Container maxW="4xl" p={[4, 8]}>
        <Stack align="center" spacing={4} textAlign="center">
          <Heading>{pageMeta.title}</Heading>
          <Text pb={8}>{pageMeta.description}</Text>

          <SimpleGrid columns={[1, 1, 2]} gap={4}>
            {data.allShowcases.map((s) => (
              <LinkBox
                key={s.id as string}
                _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
                bgColor="whiteAlpha.50"
                borderRadius="md"
                boxShadow="sm"
                d="inline-block"
                overflow="hidden"
                pos="relative"
                role="group"
                transitionDuration="fast"
                transitionProperty="common"
                transitionTimingFunction="ease-out"
              >
                <DatoImage
                  _groupHover={{ filter: "blur(2px)" }}
                  d="block"
                  data={s.image.responsiveImage}
                  transitionDuration="normal"
                  transitionProperty="common"
                  transitionTimingFunction="ease-out"
                />

                <Stack
                  _groupHover={{ opacity: 1 }}
                  align="center"
                  bgColor="blackAlpha.700"
                  fontSize="sm"
                  inset={0}
                  justify="center"
                  opacity={0}
                  pos="absolute"
                  px={8}
                  py={4}
                  transitionDuration="normal"
                  transitionProperty="common"
                  transitionTimingFunction="ease-out"
                >
                  <Heading size="lg">{s.title}</Heading>
                  <Text>{s.subtitle}</Text>
                  <LinkOverlay
                    color="yellow.200"
                    href={s.url}
                    isExternal
                    pb={4}
                  >
                    {trimHttps(s.url)}
                  </LinkOverlay>
                  <Wrap>
                    {s.tags.map((t) => (
                      <WrapItem key={t.slug}>
                        <Tag size="sm" variant="subtle">
                          {t.title}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Stack>
              </LinkBox>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
};

export default ProjectsPage;
