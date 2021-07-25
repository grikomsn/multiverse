import * as React from "react";

import DatoImage from "~components/dato-image";
import { HomeStaticPropsQuery } from "~generated/graphql";
import cms from "~lib/cms";
import { useMeta } from "~store/meta";

import { Box, Container, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "@grikomsn/shared/types/next";
import { GetStaticProps } from "next";
import NextLink from "next/link";
import { NextSeo } from "next-seo";
import { ResponsiveImageType } from "react-datocms";

interface HomePageProps {
  data: HomeStaticPropsQuery;
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const data = await cms().homeStaticProps();
  return {
    props: {
      data,
    },
  };
};

const HomePage: NextPage<HomePageProps> = (props) => {
  const { data } = props;

  const meta = useMeta();

  return (
    <>
      <NextSeo title={meta.site.seo?.siteName as string} />

      <Container maxW="4xl" p={[4, 8]}>
        <Stack align="center" spacing={4} textAlign="center">
          <NextLink href="/about" passHref>
            <Box
              _hover={{ bgColor: "whiteAlpha.50" }}
              as="a"
              borderRadius="full"
              maxW="xs"
              overflow="hidden"
              sx={{
                WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                MozBackfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                MozTransform: "translate3d(0, 0, 0)",
                WebkitTransform: "translate3d(0, 0, 0)",
              }}
              transform="auto-gpu"
              transitionDuration="normal"
              transitionProperty="common"
              transitionTimingFunction="ease-out"
            >
              <DatoImage
                data={data.site.favicon?.responsiveImage as ResponsiveImageType}
              />
            </Box>
          </NextLink>

          <Heading size="3xl">Hey! I&apos;m Griko Nibras.</Heading>

          <Text color="whiteAlpha.700" fontSize={["lg", "xl"]} maxW="2xl">
            {meta.site.seo?.fallback?.description}
          </Text>

          <Box h={8} />

          <Text pb={8}>
            Reach me via email at{" "}
            <Link href={`mailto:${meta.about?.email as string}`} variant="link">
              {meta.about?.email}
            </Link>
            , or Twitter at{" "}
            <Link
              href={`https://twitter.com/${
                meta.site.seo?.twitterAccount as string
              }`}
              isExternal
              variant="link"
            >
              {meta.site.seo?.twitterAccount}
            </Link>
            .
          </Text>
        </Stack>
      </Container>
    </>
  );
};

export default HomePage;
