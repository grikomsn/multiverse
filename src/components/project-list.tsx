import * as React from "react";

import type { Showcase } from "@/generated/graphql";

import { Heading, Img, SimpleGrid, Stack, Text } from "@chakra-ui/react";

interface ProjectListProps {
  showcase: Showcase[];
}

const ProjectList: React.FC<ProjectListProps> = ({ showcase }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} pt={4}>
      {showcase.map((s) => (
        <Stack
          key={s.sys?.id || s.title}
          _hover={{ bgColor: "whiteAlpha.400" }}
          as="a"
          bgColor="gray.600"
          borderRadius="md"
          href={s.url}
          maxH={{ base: "3xs", sm: "2xs", lg: "xs" }}
          overflow="hidden"
          pt={4}
          px={4}
          rel="noopener noreferrer"
          role="group"
          target="_blank"
          textAlign="center"
          transition="background-color 150ms ease"
        >
          <Heading size="md" variant="link">
            {s.title}
          </Heading>
          <Text>{s.tech.join(", ")}</Text>
          <Img
            _groupHover={{ transform: "translateY(-12px)" }}
            alt={s.title}
            src={s.image.url}
            transition="transform 150ms ease"
          />
        </Stack>
      ))}
    </SimpleGrid>
  );
};

export default ProjectList;
