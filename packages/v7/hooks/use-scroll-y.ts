import { useEffect, useMemo, useState } from "react";

export default function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const listener = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", listener, false);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  return useMemo(() => scrollY, [scrollY]);
}
