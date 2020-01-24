import React from 'react'

export interface AppContextDefaultValuesProps {}

export const defaultValue: AppContextDefaultValuesProps = {}

const AppContext = React.createContext(defaultValue)

export function AppProvider({ children }) {
  return (
    <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>
  )
}

export default AppContext
