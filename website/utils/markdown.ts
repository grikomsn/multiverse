import type { ElementContent } from "hast";

export const el: <T extends ElementContent>(t: T) => T = (t) => t;
