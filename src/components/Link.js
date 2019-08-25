import cns from '@sindresorhus/class-names'
import { Link as GatsbyLink } from 'gatsby'
import styled from 'styled-components'

const Link = styled(GatsbyLink).attrs(({ className }) => ({
  className: cns({ blue: !className }, 'dim', 'link'),
}))``

export default Link
