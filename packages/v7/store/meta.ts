import { createContext, useContext } from "react";

import { WebsiteSeoTagsQuery } from "~generated/graphql";

export const MetaContext = createContext<WebsiteSeoTagsQuery>(null);

export function useMeta() {
  return useContext(MetaContext);
}
