import React, { Component } from "react"
import { Button } from "./Button"
import { BoxOpening } from "./BoxOpening"

export class GameOver extends Component {
  constructor() {
    super()
    this.state = { openedBox: false, boxFinishedOpening: false }
  }

  openBox = () => {
    this.setState({ openedBox: true })
    setTimeout(() => {
      this.setState({ boxFinishedOpening: true })
    }, 3000)
  }

  render() {
    const { playerWon, cancel } = this.props
    const { openedBox, boxFinishedOpening } = this.state
    const message = playerWon
      ? "Congratulations! You guessed correctly!"
      : "Too bad! You got bluffed!"
    const subtext = playerWon
      ? "Your winnings have been deposited into your account and should show up soon."
      : "Better luck next time."
    return (
      <div>
        {!openedBox && <h3>You can now open your box!</h3>}
        <BoxOpening
          open={openedBox}
          boxFinishedOpening={boxFinishedOpening}
          hasCarrot={playerWon}
        />
        {!openedBox && (
          <div>
            <Button onClick={this.openBox} label="Open Box" />
          </div>
        )}
        {boxFinishedOpening && (
          <div>
            <div style={{ margin: 16 }}>
              <h3>{message}</h3>
              <p>{subtext}</p>
            </div>
            <div>
              <Button onClick={cancel} label="Back" />
            </div>
          </div>
        )}
      </div>
    )
  }
}
