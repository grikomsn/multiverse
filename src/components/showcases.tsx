import { Link } from "@/components";
import { useColorMode } from "@/hooks";
import { Showcase } from "@/types";
import { Box, Grid, Heading, Stack } from "@chakra-ui/core";
import dynamic from "next/dynamic";
import * as React from "react";
import { Image as DatoImage } from "react-datocms";

const MotionBox = dynamic(() => import("@/components/motion-box"), {});

type ShowcasesProps = {
  showcases: Showcase[];
  slice?: number;
};

const Showcases: React.FC<ShowcasesProps> = ({ showcases, slice }) => {
  const { isDarkMode } = useColorMode();

  const maxHeights = {
    default: "96px",
    lg: "224px",
  };

  const sliced = slice > 0 ? showcases.slice(0, slice) : showcases;

  return (
    <Box>
      <Grid
        gap={4}
        templateColumns={{
          default: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
        }}
      >
        {sliced.map(({ title, tech, image, url }, i) => (
          <Box
            key={i}
            backgroundColor={isDarkMode ? "gray.600" : "gray.100"}
            borderRadius={2}
            color="inherit"
            p={4}
            pb={0}
            textAlign="center"
          >
            <Stack h="full">
              <Stack flexGrow={1} spacing={2}>
                <Link href={url} isExternal>
                  <Heading as="h3" fontWeight="semibold" size="md">
                    {title}
                  </Heading>
                </Link>

                <Box fontSize="sm">{tech}</Box>
              </Stack>

              <Link href={url} isExternal>
                <Box maxHeight={maxHeights} overflowY="hidden">
                  <MotionBox animate initial={{ y: 0 }} whileHover={{ y: -8 }}>
                    <DatoImage data={image.responsiveImage} lazyLoad={false} />
                  </MotionBox>
                </Box>
              </Link>
            </Stack>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

Showcases.defaultProps = {
  slice: 0,
};

export default Showcases;
