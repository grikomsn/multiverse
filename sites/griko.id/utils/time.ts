import * as React from "react";

import f from "date-fns-tz/formatInTimeZone";

export function useCurrentTime(): Date;
export function useCurrentTime(format: string, tz?: string): string;

export function useCurrentTime(format?: string, tz: string = "Asia/Jakarta") {
  const raf = React.useRef<number>();
  const [time, setTime] = React.useState(() => new Date());

  function tick() {
    try {
      setTime(new Date());
      raf.current = requestAnimationFrame(tick);
    } catch {
      //
    }
  }

  React.useEffect(() => {
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoized = React.useMemo(() => {
    if (typeof format == "string") {
      return f(time, tz, format);
    }
    return time;
  }, [time, tz, format]);

  return memoized;
}
