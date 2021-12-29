import * as React from "react";

export function RegisterMediumZoom() {
  React.useEffect(() => {
    if (!window.mediumZoom) {
      void import("medium-zoom").then((mod) => {
        window.mediumZoom = mod.default({
          background: "",
          margin: 64,
        });
      });
    }
  }, []);

  return null;
}

export function useMediumZoom() {
  const [attach, setAttach] = React.useState<{ mz: ((ref: HTMLImageElement) => void) | null }>({
    mz: null,
  });

  React.useEffect(() => {
    setAttach({
      mz: (ref) => {
        window.mediumZoom?.clone().attach(ref);
      },
    });
  }, []);

  return attach?.mz;
}
