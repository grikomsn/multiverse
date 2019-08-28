import React, { createContext, useState } from 'react'

export const context = createContext({
  navState: false,
  toggleNav: () => {},
})

const PageProvider = ({ children }) => {
  const [navState, setNavState] = useState(false)

  function toggleNav() {
    setNavState(!navState)
  }

  return (
    <context.Provider value={{ navState, toggleNav }} children={children} />
  )
}

export default PageProvider
