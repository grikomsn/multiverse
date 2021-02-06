import * as React from "react";

import type { Appearance } from "@/generated/graphql";

import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import format from "date-fns/format";
import {
  FaBolt,
  FaChalkboard,
  FaMicrophone,
  FaRegCommentAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons/lib";

interface AppearanceListProps {
  appearance: Appearance[];
}

const icons: Record<string, IconType> = {
  "lightning-talk": FaBolt,
  podcast: FaMicrophone,
  talk: FaRegCommentAlt,
  workshop: FaChalkboard,
};

const AppearanceList: React.FC<AppearanceListProps> = ({ appearance }) => {
  return (
    <Box>
      {appearance.map((a, i) => (
        <React.Fragment key={a.sys?.id || a.title}>
          {i > 0 && <Divider />}
          <Flex
            _hover={{ bgColor: "whiteAlpha.100" }}
            alignItems="center"
            as="a"
            borderRadius="md"
            href={a.url}
            mx={-4}
            px={4}
            py={4}
            rel="noopener noreferrer"
            role="group"
            target="_blank"
            transition="background-color 150ms ease"
          >
            <Box pl={4} pr={8}>
              <Icon as={icons[a.category] || FaRegCommentAlt} boxSize={8} />
            </Box>
            <Stack>
              <Heading size="md" variant="link">
                {a.title}
              </Heading>
              <Text fontSize="md">
                {format(new Date(a.date), "MMMM do, Y")} - {a.subtitle}
              </Text>
              <Text color="gray.400" fontSize="sm">
                {a.tags.join(", ")}
              </Text>
            </Stack>
          </Flex>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default AppearanceList;
