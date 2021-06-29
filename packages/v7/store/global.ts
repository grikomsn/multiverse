import { useCallback, useEffect, useRef } from "react";

import create, { State } from "zustand";
import shallow from "zustand/shallow";

interface GlobalStore extends State {
  isMobileDrawerOpen: boolean;
  toggleMobileDrawer: (state?: boolean) => void;

  isCheatsheetOpen: boolean;
  toggleCheatsheet: (state?: boolean) => void;

  closeModals: () => void;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  isMobileDrawerOpen: false,
  toggleMobileDrawer: (isMobileDrawerOpen = !get().isMobileDrawerOpen) => {
    set({ isMobileDrawerOpen });
  },

  isCheatsheetOpen: false,
  toggleCheatsheet: (isCheatsheetOpen = !get().isCheatsheetOpen) => {
    set({ isCheatsheetOpen });
  },

  closeModals: () => {
    set({ isCheatsheetOpen: false, isMobileDrawerOpen: false });
  },
}));

export function useMobileDrawer() {
  const [isOpen, onToggle] = useGlobalStore(
    (store) => [store.isMobileDrawerOpen, store.toggleMobileDrawer],
    shallow,
  );

  return {
    isOpen,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    onClose: useCallback(() => onToggle(false), []),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    onOpen: useCallback(() => onToggle(true), []),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    onToggle: useCallback(() => onToggle(), []),
  };
}

export function useCheatsheet() {
  const [isOpen, onToggle] = useGlobalStore(
    (store) => [store.isCheatsheetOpen, store.toggleCheatsheet],
    shallow,
  );

  return {
    isOpen,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    onClose: useCallback(() => onToggle(false), []),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    onOpen: useCallback(() => onToggle(true), []),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    onToggle: useCallback(() => onToggle(), []),
  };
}

export function useCheatsheetSyncSetup() {
  const channel = useRef<BroadcastChannel>();
  const external = useRef(false);
  const timestamp = useRef(0);

  useEffect(() => {
    if (!("BroadcastChannel" in window)) {
      return () => {};
    }

    if (!channel.current) {
      channel.current = new BroadcastChannel("state-cheatsheet");
    }

    const unsub = useGlobalStore.subscribe<boolean>(
      (state) => {
        if (!external.current) {
          timestamp.current = Date.now();
          const data = { state, ts: timestamp.current };
          channel.current.postMessage(data);

          if (__DEV__) {
            console.info("POST", data);
          }
        }
      },
      (store) => store.isCheatsheetOpen,
    );

    function handler({ data }: MessageEvent<{ state: boolean; ts: number }>) {
      if (data.ts > timestamp.current) {
        external.current = true;
        timestamp.current = data.ts;
        useGlobalStore.setState({ isCheatsheetOpen: Boolean(data.state) });

        if (__DEV__) {
          console.info("RECV", data);
        }
      }
    }

    channel.current.addEventListener("message", handler);

    return () => {
      channel.current.removeEventListener("message", handler);
      unsub();
    };
  }, []);

  return null;
}
