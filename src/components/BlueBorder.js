import styled from 'styled-components'

const BlueBorder = styled.div`
  /* https://twitter.com/steveschoger/status/872114194816126977 */
  /* https://uigradients.com/#Hydrogen */

  /* fallback for old browsers */
  background: #9cecfb;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);

  height: 0.5rem;
`
export default BlueBorder
