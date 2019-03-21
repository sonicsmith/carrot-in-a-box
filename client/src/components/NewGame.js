import React, { Component } from "react"
import { TextInput } from "./TextInput"
import { Button } from "./Button"
import { BoxOpening } from "./BoxOpening"
import { BetSelector } from "./BetSelector"

export class NewGame extends Component {
  constructor() {
    super()
    this.state = {
      openedBox: false,
      boxFinishedOpening: false,
      blufferHasCarrot: Math.random() >= 0.5,
      blufferMessage: "",
      betAmount: null
    }
  }

  openBox = () => {
    this.setState({ openedBox: true })
    setTimeout(() => {
      this.setState({ boxFinishedOpening: true })
    }, 3000)
  }

  changeMessage = event => {
    this.setState({ blufferMessage: event.target.value })
  }

  onChangeBet = event => {
    this.setState({ betAmount: event.target.value })
  }

  render() {
    const {
      betAmount,
      blufferHasCarrot,
      blufferMessage,
      openedBox,
      boxFinishedOpening
    } = this.state
    const { createNewGame, cancel } = this.props
    const stateOfCarrot = blufferHasCarrot ? "have" : "don't have"
    const gamePlan = blufferHasCarrot ? "keep" : "swap"
    return (
      <div>
        {!openedBox && <h3>What's in your box?!</h3>}
        <BoxOpening
          open={openedBox}
          boxFinishedOpening={boxFinishedOpening}
          hasCarrot={blufferHasCarrot}
        />
        {!openedBox && (
          <div>
            <Button onClick={this.openBox} label="Open Box" />
          </div>
        )}
        {boxFinishedOpening && (
          <div>
            <div>
              <p style={{ margin: 16 }}>
                You <b>{stateOfCarrot}</b> the carrot so you need to leave a
                <br />
                message for the next player to make them <b>{gamePlan}</b> their
                box.
              </p>
            </div>
            <div style={{ margin: 16 }}>
              <span style={{ margin: 16 }}>
                Message:
                <TextInput
                  type="text"
                  placeholder={"I have the carrot"}
                  value={blufferMessage}
                  onChange={this.changeMessage}
                />
              </span>
              <span style={{ margin: 16 }}>
                Bet:
                <BetSelector
                  betAmount={betAmount}
                  onChangeBet={this.onChangeBet}
                />
              </span>
            </div>
            <div style={{ margin: 16 }}>
              <Button
                onClick={() => {
                  createNewGame(betAmount, blufferHasCarrot, blufferMessage)
                }}
                label="Submit"
              />
              <Button onClick={cancel} label="Cancel" />
            </div>
          </div>
        )}
      </div>
    )
  }
}
