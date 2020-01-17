import { MDXProvider, MDXProviderComponentsProp } from '@mdx-js/react'
import React from 'react'

import Content from '../components/content'
import Main from '../components/main'

export const defaultValue = {}

const context = React.createContext(defaultValue)

export function AppProvider({ children }) {
  const components: MDXProviderComponentsProp = {
    wrapper: props => (
      <Main>
        <Content {...props} />
      </Main>
    ),
  }

  return (
    <context.Provider value={defaultValue}>
      <MDXProvider components={components} children={children} />
    </context.Provider>
  )
}
