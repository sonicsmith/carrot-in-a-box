import React, { Component } from "react"

const BET_AMOUNTS = ["0.01", "0.05", "0.1"]

class BetSelector extends Component {
  render() {
    const { onChangeBet, betAmount } = this.props
    return (
      <div>
        <select onChange={onChangeBet} value={betAmount}>
          {BET_AMOUNTS.map(amount => (
            <option key={amount} value={amount}>
              {amount} ETH
            </option>
          ))}
        </select>
      </div>
    )
  }
}

export class NewGame extends Component {
  constructor() {
    super()
    this.state = {
      openedBox: false,
      blufferHasCarrot: Math.random() >= 0.5,
      blufferMessage: "",
      betAmount: BET_AMOUNTS[0]
    }
  }

  openBox = () => {
    this.setState({ openedBox: true })
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
      openedBox
    } = this.state
    const { createNewGame, cancel } = this.props
    return (
      <div>
        <h3>New Game</h3>
        {!openedBox ? (
          <div>
            <button onClick={this.openBox}>Open Box</button>
          </div>
        ) : (
          <div>
            <p>
              You open the box and find you {blufferHasCarrot ? "don't " : ""}
              have the carrot.
            </p>
            <p>You tell the other player:</p>
            <input
              type="text"
              placeholder={"I have the carrot"}
              value={blufferMessage}
              onChange={this.changeMessage}
            />
            <p>Bet amount</p>
            <BetSelector onChangeBet={this.onChangeBet} />
            <div>
              <button
                onClick={() => {
                  createNewGame(betAmount, blufferHasCarrot, blufferMessage)
                }}
              >
                Submit
              </button>
              <button onClick={cancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
