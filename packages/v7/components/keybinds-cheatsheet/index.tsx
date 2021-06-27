import * as React from "react";

import { KEYBINDS_MAP } from "~lib/keybinds";
import { useCheatsheet } from "~store/global";

import {
  Heading,
  HStack,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";

const KeybindsCheatsheet: React.FC = () => {
  const { isOpen, onClose } = useCheatsheet();

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalBody p={8}>
            <Heading pb={8} size="md" textAlign="center">
              Keybinds Cheatsheet
            </Heading>

            <Stack>
              {Object.entries(KEYBINDS_MAP).map(([key, desc]) => (
                <HStack key={key}>
                  <Kbd>{key}</Kbd>
                  <Text>{desc}</Text>
                </HStack>
              ))}
            </Stack>

            <Text
              color="whiteAlpha.400"
              fontSize="xs"
              pt={8}
              textAlign="center"
            >
              Press outside the menu to close
            </Text>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default KeybindsCheatsheet;
