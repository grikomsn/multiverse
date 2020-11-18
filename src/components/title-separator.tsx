import * as React from "react";

import { Heading } from "@chakra-ui/react";

interface TitleSeparatorProps {
  title: string;
  description: string;
}

const TitleSeparator: React.FC<TitleSeparatorProps> = ({
  title,
  description,
}) => {
  return (
    <>
      <Heading size="lg">{title}</Heading>
      <Heading fontWeight="regular" size="sm">
        {description}
      </Heading>
    </>
  );
};

export default TitleSeparator;
