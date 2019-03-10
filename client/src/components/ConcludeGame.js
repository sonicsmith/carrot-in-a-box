import React, { Component } from "react"
import { Button } from "./Button"

export class ConcludeGame extends Component {
  render() {
    const { onConclude, concludingGame } = this.props
    const { blufferMessage } = concludingGame
    return (
      <div>
        <h2>ConcludeGame</h2>
        <div>
          <p>The other player says: "{blufferMessage}"</p>
        </div>
        <div>Do you want to:</div>
        <div>
          <Button
            onClick={() => {
              onConclude(true)
            }}
            label="Swap for their box"
          />
          <Button
            onClick={() => {
              onConclude(false)
            }}
            label="Keep my box"
          />
        </div>
      </div>
    )
  }
}
