import styled from 'styled-components'

const Ellipsis = styled.div.attrs({
  className: 'f3-l f4',
})`
  &::before {
    content: '· · ·';
  }
`

export default Ellipsis
