import { getSdk } from "@/generated/graphql";
import { client } from "@/lib/cms-client";

export function cms() {
  return getSdk(client);
}
