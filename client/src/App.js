import React, { Component } from "react"
import CarrotInABox from "./contracts/CarrotInABox.json"
import getWeb3 from "./utils/getWeb3"

import "./App.css"

import { ActiveGames } from "./components/ActiveGames"
import { NewGame } from "./components/NewGame"
import { ConcludeGame } from "./components/ConcludeGame"
import { GameOver } from "./components/GameOver"
import { Button } from "./components/Button"
import { TopBar } from "./components/TopBar"
import { PageBottom } from "./components/PageBottom"
import { MainBanner } from "./components/MainBanner"
import { About } from "./components/About"
import { GameSetUp } from "./components/GameSetUp"

const LOADING = 0
const INFO_MODE = 1
const NEW_GAME = 2
const SHOW_ACTIVE_GAMES = 3
const CONCLUDING_GAME = 4
const GAME_CONCLUDED = 5
const GAME_SET_UP = 6

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    activeGames: [],
    gameState: INFO_MODE,
    concludingGame: null,
    playerWon: null,
    newId: -1
  }

  setupWeb3 = async () => {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = CarrotInABox.networks[networkId]
      const instance = new web3.eth.Contract(
        CarrotInABox.abi,
        deployedNetwork && deployedNetwork.address
      )
      console.log("Done with setup")
      this.setState(
        { web3, accounts, contract: instance, gameState: null },
        this.refreshView
      )
    } catch (error) {
      alert("Error: Could not connect to blockchain (Couldn't init web3)")
      console.error(error)
    }
  }

  refreshView = async () => {
    const { contract } = this.state
    if (!contract) {
      alert("Error: Could not connect to blockchain (Can't find contract)")
      return
    }
    const numGames = await contract.methods.getNumActiveGames().call()
    console.log("Number of active games", numGames)
    const activeGames = []
    for (let i = 0; i < numGames; i++) {
      const id = await contract.methods.getGameIdFromIndex(i).call()
      const weiAmount = await contract.methods.getGameBetAmount(id).call()
      const betAmount = this.state.web3.utils.fromWei(weiAmount, "ether")
      activeGames.push({ id, betAmount })
    }
    this.setState({ activeGames })
  }

  setStartNewGame = () => {
    this.setState({ gameState: NEW_GAME })
  }

  createNewGame = async (betAmount, blufferHasCarrot, blufferMessage) => {
    this.setState({ gameState: LOADING })
    const { accounts, contract } = this.state
    const value = this.state.web3.utils.toWei(betAmount || "0.01", "ether")
    const outcome = await contract.methods
      .createNewGame(blufferHasCarrot, blufferMessage)
      .send({ from: accounts[0], value, gas: 300000 })
    const { newId } = outcome.events.NewGameId.returnValues
    this.setState({ gameState: GAME_SET_UP, newId })
    this.refreshView()
  }

  cancel = () => {
    this.refreshView()
    this.setState({ gameState: null })
  }

  showActiveGames = () => {
    this.setState({ gameState: SHOW_ACTIVE_GAMES })
  }

  onSelectGame = async id => {
    const { contract } = this.state
    const betAmount = await contract.methods.getGameBetAmount(id).call()
    const blufferMessage = await contract.methods
      .getGameBlufferMessage(id)
      .call()
    this.setState({
      gameState: CONCLUDING_GAME,
      concludingGame: { betAmount, blufferMessage, id }
    })
  }

  onConclude = async swapBox => {
    this.setState({ gameState: LOADING })
    const { accounts, contract } = this.state
    const { betAmount, id } = this.state.concludingGame
    const outcome = await contract.methods
      .concludeGame(id, swapBox)
      .send({ from: accounts[0], value: betAmount, gas: 300000 })
    this.setState({ gameState: GAME_CONCLUDED })
    const { playerWon } = outcome.events.GameOutcome.returnValues
    console.log(outcome)
    this.setState({ playerWon })
  }

  // getDevFees = async () => {
  //   const { accounts, contract } = this.state
  //   const devFees = await contract.methods.getDevHoldings().call()
  //   const outcome = await contract.methods
  //     .transferDevHoldings()
  //     .send({ from: accounts[0], value: 0, gas: 300000 })
  //   console.log(devFees)
  //   console.log(outcome)
  // }

  startDapp = async () => {
    if (!this.state.web3) {
      this.setState({ gameState: LOADING })
      await this.setupWeb3()
    }
    this.setState({ gameState: null })
  }

  render() {
    const { gameState, web3 } = this.state
    const content = []
    switch (gameState) {
      case LOADING:
        content.push(<div key="loader" className="loader" />)
        break
      case SHOW_ACTIVE_GAMES:
        content.push(
          <div key="ActiveGames">
            <ActiveGames
              activeGames={this.state.activeGames}
              onSelectGame={this.onSelectGame}
              cancel={this.cancel}
            />
          </div>
        )
        break
      case CONCLUDING_GAME:
        content.push(
          <ConcludeGame
            key="ConcludeGame"
            concludingGame={this.state.concludingGame}
            onConclude={this.onConclude}
            cancel={this.cancel}
          />
        )
        break
      case NEW_GAME:
        content.push(
          <NewGame
            key="NewGame"
            createNewGame={this.createNewGame}
            cancel={this.cancel}
          />
        )
        break
      case GAME_CONCLUDED:
        content.push(
          <GameOver
            key="GameOver"
            playerWon={this.state.playerWon}
            cancel={this.cancel}
          />
        )
        break
      case INFO_MODE:
        content.push(
          <div key="InfoMode">
            <h2 className="text-center text-uppercase text-white">Play Now</h2>
            <hr className="star-light" />
            <div className="column">
              <p className="lead">
                To play this game you need ethereum and an web3 provider, such
                as{" "}
                <a href="https://metamask.io/" style={{ color: "white" }}>
                  Metamask
                </a>
              </p>
            </div>
            <Button onClick={this.startDapp} label="Begin" />
          </div>
        )
        break
      case GAME_SET_UP:
        content.push(
          <GameSetUp
            key="GameSetUp"
            cancel={this.cancel}
            newId={this.state.newId}
          />
        )
        break
      default:
        content.push(
          <div key="Default">
            <p>
              Start the game by looking in the box and bluffing?
              <br />
              Or choose which box to open after hearing the other players
              account?
            </p>
            <Button onClick={this.setStartNewGame} label="New Game" />
            <span style={{ padding: 8 }}>OR</span>
            <Button onClick={this.showActiveGames} label="Play Existing" />
          </div>
        )
    }

    const topBarLabel = gameState === INFO_MODE ? "play now" : "carrot in a box"
    return (
      <div className="App">
        <TopBar label={topBarLabel} onClick={this.startDapp} />
        {gameState === INFO_MODE && <MainBanner />}
        {gameState === INFO_MODE && <About />}
        <section
          className="bg-primary text-white mb-0"
          id="about"
          style={
            gameState === INFO_MODE
              ? {}
              : {
                  height: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingBottom: 0
                }
          }
        >
          <div className="container">{content}</div>
        </section>
        <PageBottom />
      </div>
    )
  }
}

export default App
