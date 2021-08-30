import * as React from "react";

import routes from "~routes";
import { useGlobalStore } from "~store/global";

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
import shallow from "zustand/shallow";

const routeArray = Object.entries(routes as Record<string, string>);

const MobileModal: React.FC = () => {
  const [isOpen, onClose, onOpen] = useGlobalStore(
    React.useCallback((store) => [store.isMobileDrawerOpen, store.closeMobileDrawer, store.openMobileDrawer], []),
    shallow,
  );

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
              <Text color="whiteAlpha.400" fontSize="xs" pt={8} textAlign="center">
                Press outside the menu to close
              </Text>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {isMobile && (
        <Center bottom={0} insetX={0} p={4} pointerEvents="none" pos="sticky">
          <SlideFade in={!isOpen}>
            <Button
              bgColor="blackAlpha.600"
              boxShadow="dark-lg"
              leftIcon={<Icon as={FaBars} />}
              onClick={onOpen}
              pointerEvents="visible"
              size="sm"
              sx={{
                "@supports (backdrop-filter: blur(6px))": {
                  backdropFilter: "blur(6px)",
                },
                "@supports (-webkit-backdrop-filter: blur(6px))": {
                  WebkitBackdropFilter: "blur(6px)",
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
