import styled from 'styled-components'

const ExtLink = styled.a.attrs(({ className, ext = true }) => ({
  className: `${className ? '' : 'blue'} dim link`,
  rel: ext ? 'noopener noreferrer' : '',
  target: ext ? '_blank' : '',
}))``

export default ExtLink
