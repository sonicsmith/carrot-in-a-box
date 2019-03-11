import React, { Component } from "react"
import "./../App.css"

// button.retro-button Start
export class Button extends Component {
  render() {
    const { onClick, label } = this.props
    return (
      <button
        className="btn"
        // style={{ width: 180 }}
        onClick={onClick}
      >
        {label}
      </button>
    )
  }
}
