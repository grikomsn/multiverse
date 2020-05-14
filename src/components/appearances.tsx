import { Link } from "@/components";
import { Appearance, AppearanceCategory } from "@/types";
import { formatDate } from "@/utils";
import { Box, Divider, Heading, Stack } from "@chakra-ui/core";
import * as React from "react";
import {
  FaBolt,
  FaChalkboard,
  FaMicrophone,
  FaRegCommentAlt,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

const typeIcons: Record<AppearanceCategory, IconType> = {
  ["lightning-talk"]: FaBolt,
  ["podcast"]: FaMicrophone,
  ["talk"]: FaRegCommentAlt,
  ["workshop"]: FaChalkboard,
};

type AppearancesProps = {
  appearances: Appearance[];
};

const Appearances: React.FC<AppearancesProps> = ({ appearances }) => (
  <Box>
    {appearances.map(({ title, date, subtitle, url, tags, category }, i) => (
      <React.Fragment key={i}>
        {i > 0 && (
          <Box py={2}>
            <Divider />
          </Box>
        )}

        <Stack alignItems="center" isInline spacing={4}>
          <Box as={typeIcons[category]} size="24px" w="48px" />

          <Stack w="full">
            <Link href={url}>
              <Heading as="h3" fontSize="lg" fontWeight="semibold">
                {title}
              </Heading>
            </Link>
            <Box>
              {formatDate(date)} - {subtitle}
            </Box>
            <Box color="gray.500" fontSize="sm">
              {tags}
            </Box>
          </Stack>
        </Stack>
      </React.Fragment>
    ))}
  </Box>
);

export default Appearances;
