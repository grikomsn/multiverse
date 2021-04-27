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
          <ModalContent bgColor="gray.900">
            <ModalBody d="flex" flexDir="column" justifyContent="center" p={8}>
              {routeArray.map(([route, name]) => (
                <Link key={name} href={route} passHref>
                  <Button
                    as="a"
                    colorScheme={isRoute(route) ? "yellow" : null}
                    fontWeight={isRoute(route) ? "bold" : "normal"}
                    onClick={onClose}
                    size="lg"
                    variant="ghost"
                  >
                    {name}
                  </Button>
                </Link>
              ))}
              <Text color="GrayText" fontSize="xs" pt={8} textAlign="center">
                Press outside the menu to close
              </Text>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {isMobile && (
        <Center
          bgGradient="linear(to-t, gray.900 25%, transparent)"
          bottom={0}
          insetX={0}
          p={4}
          pointerEvents="none"
          pos="sticky"
        >
          <SlideFade in={!isOpen}>
            <Button
              leftIcon={<Icon as={FaBars} />}
              onClick={onToggle}
              pointerEvents="visible"
              size="sm"
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
