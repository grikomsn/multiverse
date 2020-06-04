import * as React from "react";

import { Appearance, AppearanceCategory } from "@/types";
import { Box, Divider, Heading, Stack } from "@chakra-ui/core";
import {
  FaBolt,
  FaChalkboard,
  FaMicrophone,
  FaRegCommentAlt,
} from "react-icons/fa";

import { IconType } from "react-icons/lib";
import { Link } from "@/components";
import { formatDate } from "@/utils";
import { useColorMode } from "@/hooks";

const typeIcons: Record<AppearanceCategory, IconType> = {
  ["lightning-talk"]: FaBolt,
  ["podcast"]: FaMicrophone,
  ["talk"]: FaRegCommentAlt,
  ["workshop"]: FaChalkboard,
};

type AppearancesProps = {
  appearances: Appearance[];
};

const Appearances: React.FC<AppearancesProps> = ({ appearances }) => {
  const { isDarkMode } = useColorMode();

  return (
    <Box>
      {appearances.map(({ title, date, subtitle, url, tags, category }, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <Box py={4}>
              <Divider />
            </Box>
          )}

          <Stack alignItems="center" isInline spacing={4}>
            <Box as={typeIcons[category]} size="24px" w="48px" />

            <Stack w="full">
              <Link href={url}>
                <Heading as="h3" size="md" fontWeight="semibold">
                  {title}
                </Heading>
              </Link>
              <Box fontSize="md">
                {formatDate(date)} - {subtitle}
              </Box>
              <Box color={isDarkMode ? "gray.400" : "gray.500"} fontSize="sm">
                {tags}
              </Box>
            </Stack>
          </Stack>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Appearances;
