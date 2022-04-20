import type { State } from "zustand";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface CentralStore extends State {
  cmdQuery: string;
  isCmdOpen: boolean;
}

export const useCentralStore = create(
  subscribeWithSelector<CentralStore>((set, get) => ({
    cmdQuery: "",
    isCmdOpen: false,
  })),
);

export function setCmdQuery(cmdQuery: CentralStore["cmdQuery"]) {
  useCentralStore.setState({ cmdQuery });
}
export function openCmd() {
  useCentralStore.setState({ isCmdOpen: true });
}
export function closeCmd() {
  useCentralStore.setState({ isCmdOpen: false });
}
export function toggleCmd() {
  useCentralStore.setState((prev) => ({ isCmdOpen: !prev.isCmdOpen }));
}
