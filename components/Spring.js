import React, { Component } from 'react'

import metadata from '../metadata'

export default class Spring extends Component {
  scrollAfterClick() {
    window.scroll({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  render() {
    return (
      <div>
        <img
          src="/static/g-spring.svg"
          id="g-spring"
          alt={metadata.pageTitle}
          onClick={this.scrollAfterClick}
        />
        <style jsx>{`
          #g-spring {
            cursor: pointer;
            filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.3));
            margin: 0 auto 4rem;
            max-width: 24rem;
            transform: scale(1.125);
            transition: 250ms ease;
            width: 80%;
          }
          #g-spring:hover {
            filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.3));
            transform: scale(1.2) rotate(1deg);
          }
          #g-spring:active {
            filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.3));
            transform: scale(1.15) rotate(0.5deg);
          }
        `}</style>
      </div>
    )
  }
}
