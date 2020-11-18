import * as React from "react";

import { Heading, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import type { Showcase } from "@/generated/graphql";

interface ProjectListProps {
  showcase: Showcase[];
}

const ProjectList: React.FC<ProjectListProps> = ({ showcase }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} pt={4}>
      {showcase.map((s) => (
        <Stack
          as="a"
          bgColor="gray.600"
          borderRadius="md"
          _hover={{ bgColor: "whiteAlpha.400" }}
          href={s.url}
          key={s.sys?.id || s.title}
          maxH={{ base: "3xs", sm: "2xs", lg: "xs" }}
          overflow="hidden"
          rel="noopener noreferrer"
          role="group"
          pt={4}
          px={4}
          target="_blank"
          textAlign="center"
          transition="background-color 150ms ease"
        >
          <Heading size="md" variant="link">
            {s.title}
          </Heading>
          <Text>{s.tech.join(", ")}</Text>
          <Image
            alt={s.title}
            _groupHover={{ transform: "translateY(-12px)" }}
            src={s.image.url}
            transition="transform 150ms ease"
          />
        </Stack>
      ))}
    </SimpleGrid>
  );
};

export default ProjectList;
