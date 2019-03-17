import React, { Component } from "react"
import { Button } from "./Button"

export class GameSetUp extends Component {
  render() {
    const { cancel, newId } = this.props
    return (
      <div>
        <div style={{ margin: 16 }}>
          <h3>Game ready for next player</h3>
          <p>
            That's it! You have now set up a game for the next player.
            <br />
            If you successfully trick the other player, your winnings
            <br /> will be depostited directly into your account
          </p>
          <p>Below is the unique avatar for your game</p>
          <img
            style={{ width: 100, height: 100, display: "inline-block" }}
            src={`https://robohash.org/gameId${newId}.png?size=100x100`}
          />
        </div>
        <Button onClick={cancel} label="back" />
      </div>
    )
  }
}
