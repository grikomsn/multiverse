import * as React from "react";

export type UseToggleReturnType = {
  state: boolean;
  disable: () => void;
  enable: () => void;
  set: (newState: boolean) => void;
  toggle: () => void;
};

export type UseToggleType = (initialState?: boolean) => UseToggleReturnType;

export const useToggle: UseToggleType = (initalState = false) => {
  const [state, setState] = React.useState<boolean>(initalState);

  const disable = React.useCallback(() => setState(false), []);
  const enable = React.useCallback(() => setState(true), []);
  const set = React.useCallback((newState: boolean) => setState(newState), []);
  const toggle = React.useCallback(() => setState((prev) => !prev), []);

  return { state, disable, enable, set, toggle };
};

export const ENABLE_ON_MOUNT_KEY = "enableOnMount";
export const DISABLE_ON_MOUNT_KEY = "disableOnMount";

export type OnMountProps =
  | { [ENABLE_ON_MOUNT_KEY]?: boolean; delay?: number }
  | { [DISABLE_ON_MOUNT_KEY]?: boolean; delay?: number };

export type ToggleWrapProps = OnMountProps & {
  initialState?: boolean;
  children: (toggle: UseToggleReturnType) => React.ReactNode;
};

export type ToggleWrapType = (props: ToggleWrapProps) => JSX.Element;

export const ToggleWrap: ToggleWrapType = ({ delay, initialState, children, ...props }) => {
  const toggle = useToggle(initialState);

  React.useEffect(() => {
    function invokeWithDelay(fn: Function) {
      return typeof delay == "number" ? setTimeout(fn, delay) : fn();
    }
    if (ENABLE_ON_MOUNT_KEY in props) invokeWithDelay(toggle.enable);
    if (DISABLE_ON_MOUNT_KEY in props) invokeWithDelay(toggle.disable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children(toggle)}</>;
};

export type ClientOnlyProps = {
  children: React.ReactNode;
};

export function ClientOnly({ children }: ClientOnlyProps) {
  return (
    <ToggleWrap enableOnMount initialState={false}>
      {() => children}
      {/*  */}
    </ToggleWrap>
  );
}
