import * as React from "react";

import { baseComponents } from "~components/markdown";
import { useGlobalStore } from "~store/global";
import { useMeta } from "~store/meta";

import {
  ButtonGroup,
  Container,
  Icon,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { BiCommand } from "react-icons/bi";
import { FaGithub, FaTwitter } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

function content(owner: unknown) {
  return `
Contents licensed under [CC BY-NC-SA 4.0](https://griko.dev/cc-by-nc-sa).${"  "}
Made using [Next.js](https://nextjs.org), [Chakra UI](https://chakra-ui.com),
and [DatoCMS](https://www.datocms.com). Hosted on [Vercel](https://vercel.com).

MIT License &copy; ${new Date().getFullYear()}&ndash;present
[${String(owner)}](.). Version 7.
`.trim();
}

const Footer: React.FC = () => {
  const meta = useMeta();

  const { GitHub, Twitter } = meta.about?.socialsJson as Record<string, string>;

  const open = useGlobalStore(
    React.useCallback((store) => store.openCheatsheet, []),
  );

  return (
    <Container as="footer" color="whiteAlpha.700" maxW="4xl" p={[4, 8]}>
      <Stack align="center" fontSize="xs" spacing={4} textAlign="center">
        <ReactMarkdown components={baseComponents}>
          {content(meta.site.seo?.siteName)}
        </ReactMarkdown>
        <ButtonGroup>
          <IconButton
            aria-label="GitHub"
            as="a"
            href={GitHub}
            icon={<Icon as={FaGithub} />}
            rounded="full"
            target="_blank"
            variant="ghost"
          />
          <IconButton
            aria-label="Twitter"
            as="a"
            href={Twitter}
            icon={<Icon as={FaTwitter} />}
            rounded="full"
            target="_blank"
            variant="ghost"
          />
          <IconButton
            aria-label="Open keybinds cheatsheet"
            icon={<Icon as={BiCommand} />}
            onClick={() => open()}
            rounded="full"
            variant="ghost"
          />
        </ButtonGroup>
      </Stack>
    </Container>
  );
};

export default Footer;
