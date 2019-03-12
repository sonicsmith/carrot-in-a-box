import React, { Component } from "react"

export class MainBanner extends Component {
  render() {
    return (
      <header className="masthead bg-primary text-white text-center">
        <div className="container">
          <img
            className="img-fluid mb-5 d-block mx-auto"
            src="img/carrotInABox.png"
            alt=""
          />
          <h1 className="text-uppercase mb-0">Carrot in a Box</h1>
          <hr className="star-light" />
          <h2 className="font-weight-light mb-0">
            A carrot, a box, and a game of bluff...
          </h2>
        </div>
      </header>
    )
  }
}
