import React, { Component } from "react"

export class About extends Component {
  render() {
    return (
      <section id="contact">
        <div className="container">
          <h2 className="text-center text-uppercase text-secondary mb-0">
            What is this
          </h2>
          <hr className="star-dark mb-5" />
          <div className="column">
            <p className="lead">
              This is a game where you can win real money by betting
              crytocurrency to bluff other people that you have a carrot in your
              box.
              <br />
              Sound ridiculous? It is, welcome to "Carrot In A Box", the new hit
              blockchain game.
            </p>
          </div>
        </div>
      </section>
    )
  }
}
