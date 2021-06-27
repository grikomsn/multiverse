import * as React from "react";

import routes from "~routes";
import { useMobileDrawer } from "~store/global";

import {
  Button,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SlideFade,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBars } from "react-icons/fa";

const routeArray = Object.entries(routes as Record<string, string>);

const MobileModal: React.FC = () => {
  const { isOpen, onClose, onToggle } = useMobileDrawer();

  const router = useRouter();

  const isRoute = React.useCallback(
    (route: string) => {
      return router.route == route;
    },
    [router.route],
  );

  const isMobile = useBreakpointValue({ base: true, sm: false });

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay>
          <ModalContent>
            <ModalBody d="flex" flexDir="column" justifyContent="center" p={8}>
              {routeArray.map(([route, name]) => (
                <Link key={name} href={route} passHref>
                  <Button
                    as="a"
                    colorScheme={isRoute(route) ? "yellow" : undefined}
                    fontWeight={isRoute(route) ? "bold" : "normal"}
                    onClick={onClose}
                    size="lg"
                    variant="ghost"
                  >
                    {name}
                  </Button>
                </Link>
              ))}
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

      {isMobile && (
        <Center
          bgGradient="linear(to-t, gray.900, transparent)"
          bottom={0}
          insetX={0}
          p={4}
          pointerEvents="none"
          pos="sticky"
        >
          <SlideFade in={!isOpen}>
            <Button
              bgColor="blackAlpha.600"
              leftIcon={<Icon as={FaBars} />}
              onClick={onToggle}
              pointerEvents="visible"
              size="sm"
              sx={{
                "@supports (backdrop-filter: blur(6px))": {
                  backdropFilter: "blur(6px)",
                  bgColor: "whiteAlpha.50",
                },
                "@supports (-webkit-backdrop-filter: blur(6px))": {
                  WebkitBackdropFilter: "blur(6px)",
                  bgColor: "whiteAlpha.50",
                },
              }}
              variant="outline"
            >
              Open menu
            </Button>
          </SlideFade>
        </Center>
      )}
    </>
  );
};

export default MobileModal;
