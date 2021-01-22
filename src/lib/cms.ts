import { client } from "@/lib/cms-client";
import { getSdk } from "@/generated/graphql";

export function cms() {
  return getSdk(client);
}
