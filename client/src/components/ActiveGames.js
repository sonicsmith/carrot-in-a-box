import React, { Component } from "react"

class ActiveGame extends Component {
  render() {
    const { betAmount } = this.props
    return (
      <div>
        <button onClick={this.setStartNewGame}>{betAmount} ETH</button>
      </div>
    )
  }
}

export class ActiveGames extends Component {
  render() {
    const { activeGames } = this.props
    if (activeGames.length === 0) {
      return <h2>No Active Games</h2>
    }

    return (
      <div>
        {activeGames.map(game => (
          <ActiveGame key={game.id} betAmount={game.betAmount} />
        ))}
      </div>
    )
  }
}
