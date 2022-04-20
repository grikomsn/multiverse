import { useEffect, useRef } from "react";

import { setTime } from ".";

export function Ticker() {
  const raf = useRef<number>();

  function tick() {
    try {
      setTime(new Date());
      raf.current = requestAnimationFrame(tick);
    } catch {
      //
    }
  }

  useEffect(() => {
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
