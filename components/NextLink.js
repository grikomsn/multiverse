import React, { Component } from 'react'

import Link from 'next/link'

export default class extends Component {
  render() {
    return (
      <Link href={this.props.href}>
        <a {...this.props}>{this.props.children}</a>
      </Link>
    )
  }
}
