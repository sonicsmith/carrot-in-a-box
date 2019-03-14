import React, { Component } from "react"

export class BoxOpening extends Component {
  render() {
    const { open, boxFinishedOpening, hasCarrot } = this.props
    return (
      <img
        style={boxFinishedOpening ? { width: "20%" } : { width: "30%" }}
        src={open ? "img/box-open-anim.gif" : "img/box-closed.gif"}
        alt=""
      />
    )
  }
}
