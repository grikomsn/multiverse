import cns from '@sindresorhus/class-names'
import styled from 'styled-components'

const ExtLink = styled.a.attrs(({ className, ext = true }) => ({
  className: cns({ blue: !className }, 'dim', 'link'),
  rel: ext ? 'noopener noreferrer' : '',
  target: ext ? '_blank' : '',
}))``

export default ExtLink
