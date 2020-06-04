import * as React from "react";

import Highlight, { Language, Prism } from "prism-react-renderer";

import { Box } from "@chakra-ui/core";
import githubTheme from "prism-react-renderer/themes/github";
import oceanicNextTheme from "prism-react-renderer/themes/oceanicNext";
import { useColorMode } from "@/hooks";

type SnippetProps = {
  code: string;
  language: Language;
};

const Snippet: React.FC<SnippetProps> = ({ code, language }) => {
  const { isDarkMode } = useColorMode();

  const theme = isDarkMode ? oceanicNextTheme : githubTheme;

  return (
    <Box>
      <Highlight Prism={Prism} theme={theme} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Box
            as="pre"
            borderRadius={4}
            className={className}
            fontSize={{ default: "sm", md: "md" }}
            overflow="auto"
            p={4}
            style={style}
          >
            {tokens.map((line, i) => (
              <Box {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
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
