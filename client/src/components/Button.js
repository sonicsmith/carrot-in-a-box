import React, { Component } from "react"
import "./../App.css"

export class Button extends Component {
  render() {
    const { onClick, label } = this.props
    return (
      <button className="btn" onClick={onClick}>
        {label}
      </button>
    )
  }
}
