import { Link } from "@/components";
import { Box, Heading, Stack } from "@chakra-ui/core";
import * as React from "react";

type IndexSectionProps = {
  title: string;
  subtitle: string;
  route: string;
  routeText: string;
};

const IndexSection: React.FC<IndexSectionProps> = ({
  title,
  subtitle,
  route,
  routeText,
  children,
}) => (
  <Stack spacing={8}>
    <Stack>
      <Heading as="h2" size="lg">
        {title}
      </Heading>
      <Box fontSize="sm">{subtitle}</Box>
    </Stack>

    {children}

    {route && routeText && (
      <Box fontSize="sm" py={4} textAlign="right">
        <Link isNextLink href={route}>
          {routeText}
        </Link>
      </Box>
    )}
  </Stack>
);

export default IndexSection;
