import { SiteConfig } from "@/types";
import * as React from "react";

export const SiteConfigContext = React.createContext<Partial<SiteConfig>>({});

export const SiteConfigProvider = SiteConfigContext.Provider;
