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
              Carrot In A Box is a game where you can win real money by betting
              crytocurrency,
              <br />
              and bluffing people online that you do, or do not have a virtual
              carrot in your box.
              <br />
              This "dapp" was inspired by the game played on the British TV game{" "}
              <br />
              show, "8 out of 10 cats". Watch now on{" "}
              <a
                href="https://www.youtube.com/watch?v=pB7T_J5K7_4"
                style={{ textDecorationLine: "underline" }}
              >
                Youtube
              </a>
              <br />
              (Only 1% dev fees)
            </p>
          </div>
        </div>
      </section>
    )
  }
}
