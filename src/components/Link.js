import styled from 'styled-components'

const Link = styled.a`
  color: inherit;
  font-weight: ${props => (props.normal ? 'normal' : 'bold')};

  &:hover {
    color: inherit;
  }
`

Link.defaultProps = {
  rel: 'noopener noreferrer',
  target: 'blank',
}

export default Link
