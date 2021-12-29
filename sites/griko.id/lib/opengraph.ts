import meta from "@/config/meta.json";

export type MainOpengraphQuery = {
  title?: string;
  description?: string;
  path?: string;
  modifier?: Modifier;
  image?: string;
};

export type Modifier = "normal" | "larger";

export function createQueryParams(query: MainOpengraphQuery) {
  return new URLSearchParams(query);
}

export function getQuery({
  title = meta.name,
  description = meta.description,
  path = "",
  modifier = "larger",
  image,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): MainOpengraphQuery {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { title, description, path, modifier, image };
}
