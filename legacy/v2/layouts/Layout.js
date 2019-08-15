import '../stylesheets/style.scss'

import PropTypes from 'prop-types'

import Helmet from '../components/Helmet'
import LegacyNotice from '../components/LegacyNotice'
import metadata from '../metadata'

const Layout = ({ pageTitle, colorHex, children }) => {
  const helmetProps = { pageTitle, colorHex }
  return (
    <>
      <Helmet {...helmetProps} />
      {children}
      <LegacyNotice />
      <style global jsx>{`
        html,
        body,
        ::selection {
          background-color: ${colorHex};
        }
      `}</style>
    </>
  )
}

Layout.propTypes = {
  colorHex: PropTypes.string,
  pageTitle: PropTypes.string,
}

Layout.defaultProps = {
  colorHex: metadata.colorHex,
  pageTitle: metadata.pageTitle,
}

export default Layout
