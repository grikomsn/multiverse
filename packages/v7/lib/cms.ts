import { getSdk } from "~generated/graphql";

import client from "@grikomsn/shared/lib/datocms-client";

export default function cms() {
  return getSdk(client);
}
