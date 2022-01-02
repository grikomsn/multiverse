/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import meta from "@/config/meta.json";

export const MODIFIERS = ["normal", "larger"] as const;
export const TYPES = ["main"] as const;

export type MainOpengraphQuery = {
  title?: string;
  description?: string;
  path?: string;
  modifier?: Modifier;
  image?: string;
};

export type Modifier = typeof MODIFIERS[number];
export type Type = typeof TYPES[number];

export function createQueryParams(query: MainOpengraphQuery) {
  return new URLSearchParams(query);
}

export function getQuery({ title, description, path, modifier, image }: MainOpengraphQuery): MainOpengraphQuery {
  return {
    title: title || meta.name,
    description: description || meta.description,
    path,
    modifier: modifier || "larger",
    image,
  };
}
