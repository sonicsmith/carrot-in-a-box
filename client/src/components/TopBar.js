import React, { Component } from "react"

export class TopBar extends Component {
  render() {
    const { onClick, label } = this.props
    return (
      <nav
        className="navbar navbar-expand-lg bg-secondary fixed-top text-uppercase"
        id="mainNav"
      >
        <div className="container">
          <a
            className="navbar-brand js-scroll-trigger"
            onClick={onClick}
            href="javascript:void(0)"
          >
            {label}
          </a>
        </div>
      </nav>
    )
  }
}
