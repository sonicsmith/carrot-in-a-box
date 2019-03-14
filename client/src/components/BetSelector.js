import React, { Component } from "react"

const BET_AMOUNTS = ["0.01", "0.02", "0.05", "0.10", "0.20", "0.50", "1.00"]

export class BetSelector extends Component {
  render() {
    const { onChangeBet, betAmount } = this.props
    return (
      <select
        onChange={onChangeBet}
        value={betAmount || BET_AMOUNTS[0]}
        style={{
          padding: "0.6em 1.4em",
          border: "2px solid #d5a67a",
          borderRadius: "0.6em",
          marginLeft: 8
        }}
      >
        {BET_AMOUNTS.map(amount => (
          <option key={amount} value={amount}>
            {amount} ETH
          </option>
        ))}
      </select>
    )
  }
}
