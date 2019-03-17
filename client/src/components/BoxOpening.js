import React, { Component } from "react"

export class BoxOpening extends Component {
  constructor() {
    super()
    this.state = { startFrame: "img/box-closed.gif" }
  }
  trigger() {
    setTimeout(() => {
      this.setState({ startFrame: "" })
    }, 1)
  }
  render() {
    const { open, boxFinishedOpening, hasCarrot } = this.props
    if (open && !this.triggered) {
      this.triggered = true
      this.trigger()
    }
    return (
      open && (
        <img
          style={boxFinishedOpening ? { width: "20%" } : { width: "30%" }}
          src={
            this.state.startFrame ||
            `img/box-open-anim-${hasCarrot ? "win" : "lose"}.gif`
          }
          alt={hasCarrot ? "Box with carrot" : "Empty box"}
        />
      )
    )
  }
}
