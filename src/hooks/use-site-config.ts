import * as React from "react";

import { SiteConfigContext } from "@/store/site-config";

const useSiteConfig = () => {
  const siteConfig = React.useContext(SiteConfigContext);
  return siteConfig;
};

export default useSiteConfig;
