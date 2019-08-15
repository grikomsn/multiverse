import styled from 'styled-components'

import metadata from '../metadata'

const SpringDiv = styled.img`
  & {
    cursor: pointer;
    filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.3));
    margin: 0 auto 4rem;
    max-width: 24rem;
    transform: scale(1.125);
    transition: 250ms ease;
    width: 80%;
  }

  &:hover {
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.3));
    transform: scale(1.2) rotate(1deg);
  }

  &:active {
    filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.3));
    transform: scale(1.15) rotate(0.5deg);
  }
`

const scrollOnClick = () =>
  window.scroll({
    top: window.innerHeight,
    behavior: 'smooth',
  })

const Spring = () => (
  <SpringDiv
    src="/static/g-spring.svg"
    alt={metadata.pageTitle}
    onClick={scrollOnClick}
  />
)

export default Spring
