import { SiteConfigContext } from "@/store/site-config";
import * as React from "react";

const useSiteConfig = () => {
  const siteConfig = React.useContext(SiteConfigContext);
  return siteConfig;
};

export default useSiteConfig;
