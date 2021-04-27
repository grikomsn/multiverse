import create, { State } from "zustand";
import shallow from "zustand/shallow";

interface GlobalStore extends State {
  isMobileDrawerOpen: boolean;
  toggleMobileDrawer: (state?: unknown) => void;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  isMobileDrawerOpen: false,
  toggleMobileDrawer: (isMobileDrawerOpen = !get().isMobileDrawerOpen) => {
    set({ isMobileDrawerOpen: Boolean(isMobileDrawerOpen) });
  },
}));

export function useMobileDrawer() {
  const [isOpen, onToggle] = useGlobalStore(
    (store) => [store.isMobileDrawerOpen, store.toggleMobileDrawer],
    shallow,
  );
  return {
    isOpen,
    onClose: () => onToggle(false),
    onOpen: () => onToggle(true),
    onToggle,
  };
}
