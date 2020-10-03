/* eslint-disable react/no-array-index-key */

import * as React from "react";

import Highlight, { Prism } from "prism-react-renderer";

import { Box } from "@chakra-ui/core";
import type { Language } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/oceanicNext";

interface SnippetProps {
  code: string;
  language: Language;
}

const Snippet: React.FC<SnippetProps> = ({ code, language }) => {
  return (
    <Box>
      <Highlight code={code} language={language} Prism={Prism} theme={theme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Box
            as="pre"
            borderRadius={4}
            className={className}
            fontSize={{ base: "sm", md: "md" }}
            overflow="auto"
            p={4}
            style={style}
          >
            {tokens.map((line, i) => (
              <Box key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, j) => (
                  <span key={j} {...getTokenProps({ token, key: j })} />
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Highlight>

      <Box color="gray.500" fontSize="sm" textAlign="right" pr={2}>
        {language} snippet
      </Box>
    </Box>
  );
};

export default Snippet;
