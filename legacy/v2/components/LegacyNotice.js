import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Link from './ExternalLink'

const Container = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
`

const LegacyNotice = () => {
  const key = 'isLegacyNoticeDismissed'
  const [visible, setVisible] = useState(true)

  const dismiss = () => {
    sessionStorage.setItem(key, 'dismissed')
    setVisible(false)
  }

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(key) === 'dismissed'
    setVisible(!isDismissed)
  })

  return (
    visible && (
      <Container>
        <div className="notification is-info">
          <button className="delete" onClick={dismiss} />
          <b>You are viewing the legacy version.</b>
          <br />
          Visit the latest version at{' '}
          <Link href="https://griko.id">https://griko.id</Link>.
        </div>
      </Container>
    )
  )
}

export default LegacyNotice
