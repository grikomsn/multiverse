import * as React from "react";

import { Box } from "@chakra-ui/react";
import type { Language } from "prism-react-renderer";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/oceanicNext";

interface SnippetProps {
  code: string;
  language: Language;
}

const Snippet: React.FC<SnippetProps> = ({ code, language }) => {
  return (
    <Box>
      <Highlight Prism={Prism} code={code} language={language} theme={theme}>
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

      <Box color="gray.500" fontSize="sm" pr={2} textAlign="right">
        {language} snippet
      </Box>
    </Box>
  );
};

export default Snippet;
