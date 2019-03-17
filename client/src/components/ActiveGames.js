import React, { Component } from "react"
import { Button } from "./Button"

class ActiveGame extends Component {
  render() {
    const { betAmount, gameId, onSelectGame } = this.props
    return (
      <button
        className="btn"
        style={{
          width: 180,
          height: 100,
          padding: 0
        }}
        onClick={() => {
          onSelectGame(gameId)
        }}
      >
        <img
          style={{ width: 70, height: 70, display: "inline-block" }}
          src={`https://robohash.org/gameId${gameId}.png?size=70x70`}
        />
        {`${betAmount} ETH`}
      </button>
    )
  }
}

export class ActiveGames extends Component {
  render() {
    const { activeGames, onSelectGame, cancel } = this.props
    return (
      <div>
        <h2>Active Games:</h2>
        <div style={{ margin: 24 }}>
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
        </div>
        <div>
          <Button onClick={cancel} label="Back" />
        </div>
      </div>
    )
  }
}
