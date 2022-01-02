import * as React from "react";

import { ZoomSelector } from "medium-zoom";

export function RegisterMediumZoom() {
  React.useEffect(() => {
    if (!window.mediumZoom) {
      void import("medium-zoom").then((mod) => {
        window.mediumZoom = mod.default({
          background: "",
          margin: 16,
        });
      });
    }
  }, []);

  return null;
}

export function useMediumZoom(deps: unknown[] = []) {
  const [attach, setAttach] = React.useState<{ mz: (ref: unknown) => void }>({
    mz: () => {},
  });

  React.useEffect(() => {
    setAttach({
      mz: (ref) => {
        window.mediumZoom?.clone().attach(ref as ZoomSelector);
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return attach?.mz;
}
