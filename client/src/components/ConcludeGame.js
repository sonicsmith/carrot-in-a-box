import React, { Component } from "react"
import { Button } from "./Button"

export class ConcludeGame extends Component {
  render() {
    const { onConclude, concludingGame, cancel } = this.props
    const { blufferMessage } = concludingGame
    return (
      <div>
        <div style={{ marginTop: 16, marginBottom: 48 }}>
          <p>
            The other player has seen the contents of their box, and responds
            with:{" "}
          </p>
          <p
            className="speech-bubble"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            "{blufferMessage}"
          </p>
        </div>
        <p>Do you want to:</p>
        <div>
          <Button
            onClick={() => {
              onConclude(true)
            }}
            label="Take their box"
          />
          <Button
            onClick={() => {
              onConclude(false)
            }}
            label="Keep your box"
          />
        </div>
        <Button onClick={cancel} label="cancel" />
      </div>
    )
  }
}
