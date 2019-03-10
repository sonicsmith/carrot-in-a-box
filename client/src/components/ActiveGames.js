import React, { Component } from "react"
import { Button } from "./Button"

class ActiveGame extends Component {
  render() {
    const { betAmount, gameId, onSelectGame } = this.props
    return (
      <div>
        <Button
          onClick={() => {
            onSelectGame(gameId)
          }}
          label={`${betAmount} ETH`}
        />
      </div>
    )
  }
}

export class ActiveGames extends Component {
  render() {
    const { activeGames, onSelectGame, cancel } = this.props
    return (
      <div>
        <h2>Active Games:</h2>
        {activeGames.length > 0
          ? activeGames.map(game => (
              <ActiveGame
                key={game.id}
                gameId={game.id}
                betAmount={game.betAmount}
                onSelectGame={onSelectGame}
              />
            ))
          : "No current games"}
        <div>
          <Button onClick={cancel} label="Back" />
        </div>
      </div>
    )
  }
}
