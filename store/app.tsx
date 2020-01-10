import React from 'react'

export const defaultValue = {}

const context = React.createContext(defaultValue)

export function AppProvider({ children }) {
  return <context.Provider value={defaultValue} children={children} />
}
