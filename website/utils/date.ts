import format from "date-fns/format";
import parse from "date-fns/parse";

export function parseIsoToMdy(input: unknown) {
  return format(new Date(String(input)), "MMMM dd, yyyy");
}

export function parseYmd(input: unknown) {
  return parse(String(input), "yyyy-MM-dd", new Date());
}

export function parseYmdToMy(input: unknown) {
  return format(parseYmd(input), "MMMM yyyy");
}
