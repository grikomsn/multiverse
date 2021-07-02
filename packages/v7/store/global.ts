import { useEffect, useRef } from "react";

import create, { State } from "zustand";

interface GlobalStore extends State {
  isMobileDrawerOpen: boolean;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: (state?: boolean) => void;

  isCheatsheetOpen: boolean;
  openCheatsheet: () => void;
  closeCheatsheet: () => void;
  toggleCheatsheet: (state?: boolean) => void;

  closeModals: () => void;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  isMobileDrawerOpen: false,
  openMobileDrawer: () => set({ isMobileDrawerOpen: true }),
  closeMobileDrawer: () => set({ isMobileDrawerOpen: false }),
  toggleMobileDrawer: (isMobileDrawerOpen = !get().isMobileDrawerOpen) => {
    set({ isMobileDrawerOpen });
  },

  isCheatsheetOpen: false,
  openCheatsheet: () => set({ isCheatsheetOpen: true }),
  closeCheatsheet: () => set({ isCheatsheetOpen: false }),
  toggleCheatsheet: (isCheatsheetOpen = !get().isCheatsheetOpen) => {
    set({ isCheatsheetOpen });
  },

  closeModals: () => {
    set({ isCheatsheetOpen: false, isMobileDrawerOpen: false });
  },
}));

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
        external.current = false;

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
