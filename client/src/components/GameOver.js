import React, { Component } from "react"
import { Button } from "./Button"

export class GameOver extends Component {
  render() {
    const { playerWon, cancel } = this.props
    return (
      <div>
        <h2>Game Over</h2>
        <div>
          <p>The carrot {playerWon ? "was" : "was not"} in your box.</p>
          <p>You {playerWon ? "won" : "lost"} the game.</p>
        </div>
        <div>
          <Button onClick={cancel} label="Back" />
        </div>
      </div>
    )
  }
}
