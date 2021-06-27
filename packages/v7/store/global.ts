import { useCallback } from "react";

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
