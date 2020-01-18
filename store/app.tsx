import { MDXProvider, MDXProviderComponentsProp } from '@mdx-js/react'
import React from 'react'

import Content from '../components/content'

export const defaultValue = {}

const context = React.createContext(defaultValue)

export function AppProvider({ children }) {
  const components: MDXProviderComponentsProp = {
    wrapper: props => <Content {...props} />
  }

  return (
    <context.Provider value={defaultValue}>
      <MDXProvider components={components} children={children} />
    </context.Provider>
  )
}
