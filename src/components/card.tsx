import * as React from "react";

import { Box, BoxProps, Stack, StackProps } from "@chakra-ui/core";
import { Image as DatoImage, ResponsiveImageType } from "react-datocms";

import { useColorMode } from "@/hooks";

type CardProps = StackProps & {
  headerResponsiveImage?: ResponsiveImageType;
  boxProps?: BoxProps;
};

const Card: React.FC<CardProps> = ({
  headerResponsiveImage,
  boxProps,
  children,
  ...props
}) => {
  const { isDarkMode } = useColorMode();

  return (
    <Box
      backgroundColor={isDarkMode ? "gray.700" : "white"}
      borderRadius={{ default: 0, md: 4 }}
      boxShadow="md"
      {...boxProps}
    >
      {headerResponsiveImage && (
        <Box
          backgroundColor="gray.100"
          borderTopLeftRadius={{ default: 0, md: 4 }}
          borderTopRightRadius={{ default: 0, md: 4 }}
          overflow="hidden"
        >
          <DatoImage data={headerResponsiveImage} />
        </Box>
      )}

      <Stack p={8} spacing={8} {...props}>
        {children}
      </Stack>
    </Box>
  );
};

export default Card;
