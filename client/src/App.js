import React, { Component } from "react"
import CarrotInABox from "./contracts/CarrotInABox.json"
import getWeb3 from "./utils/getWeb3"

import "./App.css"

import { ActiveGames } from "./components/ActiveGames"
import { NewGame } from "./components/NewGame"
import { ConcludeGame } from "./components/ConcludeGame.js"
import { GameOver } from "./components/GameOver.js"
import { Button } from "./components/Button"

const LOADING = 0
const NEW_GAME = 1
const SHOW_ACTIVE_GAMES = 2
const CONCLUDING_GAME = 3
const GAME_CONCLUDED = 4

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    activeGames: [],
    gameState: null,
    concludingGame: null,
    playerWon: null
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = CarrotInABox.networks[networkId]

      const instance = new web3.eth.Contract(
        CarrotInABox.abi,
        deployedNetwork && deployedNetwork.address
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.refreshView)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  refreshView = async () => {
    const { contract } = this.state
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
    const value = this.state.web3.utils.toWei(betAmount, "ether")
    await contract.methods
      .createNewGame(blufferHasCarrot, blufferMessage)
      .send({ from: accounts[0], value, gas: 300000 })
    this.setState({ gameState: null })
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

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    const content = []
    switch (this.state.gameState) {
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
      default:
        content.push(
          <div key="Default">
            <p>Short instructions here about how to play the game.</p>
            <Button onClick={this.setStartNewGame} label="New Game" />
            <Button onClick={this.showActiveGames} label="Play Existing" />
          </div>
        )
    }
    return (
      <div className="App">
        <h1 key="title">Carrot In a Box</h1>
        {content}
      </div>
    )
  }
}

export default App
