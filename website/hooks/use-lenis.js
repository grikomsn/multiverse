import Lenis from "@studio-freight/lenis";
import { useEffect, useRef } from "react";

export function useLenis() {
  const frame = useRef(0);

  useEffect(() => {
    window.lenis = new Lenis({
      lerp: 0.1,
      smooth: true,
      direction: "vertical",
    });
    function raf() {
      window.lenis.raf();
      return requestAnimationFrame(raf);
    }
    frame.current = raf();
    return () => {
      cancelAnimationFrame(frame.current);
      window.lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  return null;
}
