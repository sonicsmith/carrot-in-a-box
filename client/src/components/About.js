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
              box. (Only 1% dev fees)
              <br />
              Sound ridiculous? It is! Welcome to the new hit blockchain game,
              "Carrot In A Box"
            </p>
          </div>
        </div>
      </section>
    )
  }
}
