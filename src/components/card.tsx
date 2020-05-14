import { useColorMode } from "@/hooks";
import { Box, BoxProps, Stack, StackProps } from "@chakra-ui/core";
import * as React from "react";
import { Image as DatoImage, ResponsiveImageType } from "react-datocms";

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
