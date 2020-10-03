import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppContextProps {
  //
}

export const AppContext = React.createContext<AppContextProps>({});

export const AppProvider = AppContext.Provider;
