import React, { Component } from "react"
import { Button } from "./Button"

export class NoConnection extends Component {
  render() {
    return (
      <div>
        <div style={{ margin: 16 }}>
          <h3>No Connection</h3>
          Cannot connect to blockchain, please make sure you a logged in to your
          Web3 provider.
        </div>
        <Button onClick={this.props.cancel} label="back" />
        <Button onClick={this.props.retry} label="retry" />
      </div>
    )
  }
}
