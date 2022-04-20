import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { useMemo } from "react";
import create from "zustand";

export const useTimeStore = create(() => ({ time: new Date() }));

export function setTime(time: Date) {
  useTimeStore.setState({ time });
}

export function useCurrentTime(): Date;
export function useCurrentTime(format: string, tz?: string): string;

export function useCurrentTime(format?: string, tz = "Asia/Jakarta") {
  const { time } = useTimeStore();

  const memoized = useMemo(() => {
    if (typeof format === "string") {
      return formatInTimeZone(time, tz, format);
    }
    return time;
  }, [time, tz, format]);

  return memoized;
}
