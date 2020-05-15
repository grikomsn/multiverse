import { format as fnsFormat } from "date-fns";

export const isDev = process.env.NODE_ENV === "development";

export const formatDate = (date: string) =>
  fnsFormat(new Date(date), "LLLL do, uuuu");
