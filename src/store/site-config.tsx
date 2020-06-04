import * as React from "react";

import { SiteConfig } from "@/types";

export const SiteConfigContext = React.createContext<Partial<SiteConfig>>({});

export const SiteConfigProvider = SiteConfigContext.Provider;
