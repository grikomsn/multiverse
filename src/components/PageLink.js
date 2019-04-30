import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const PageLink = styled(Link)`
  color: inherit;
  font-weight: ${props => (props.normal ? 'normal' : 'bold')};

  &:hover {
    color: inherit;
  }
`

PageLink.propTypes = {
  normal: PropTypes.bool,
}

export default PageLink
