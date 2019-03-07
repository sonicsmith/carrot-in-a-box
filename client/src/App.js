import React, { Component } from "react"
import CarrotInABox from "./contracts/CarrotInABox.json"
import getWeb3 from "./utils/getWeb3"

import "./App.css"

import { ActiveGames } from "./components/ActiveGames"
import { NewGame } from "./components/NewGame"
import { ConcludeGame } from "./components/ConcludeGame.js"

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    activeGames: [],
    creatingNewGame: false,
    concludingGame: null,
    loading: false
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
    const { accounts, contract } = this.state
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
    this.setState({ creatingNewGame: true })
  }

  createNewGame = async (betAmount, blufferHasCarrot, blufferMessage) => {
    this.setState({ creatingNewGame: false, loading: true })
    const { accounts, contract } = this.state
    const value = this.state.web3.utils.toWei(betAmount, "ether")
    await contract.methods
      .createNewGame(blufferHasCarrot, blufferMessage)
      .send({ from: accounts[0], value, gas: 300000 })
    // console.log(index)
    this.setState({ loading: false })
  }

  cancelNewGame = () => {
    this.setState({ creatingNewGame: false })
  }

  onSelectGame = async id => {
    const { contract } = this.state
    const betAmount = await contract.methods.getGameBetAmount(id).call()
    const blufferMessage = await contract.methods
      .getGameBlufferMessage(id)
      .call()
    this.setState({ concludingGame: { betAmount, blufferMessage } })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        <h1>Carrot In a Box</h1>
        {this.state.loading ? (
          <div className="loader" />
        ) : this.state.concludingGame ? (
          <div>
            <ConcludeGame />
          </div>
        ) : this.state.creatingNewGame ? (
          <div>
            <NewGame
              createNewGame={this.createNewGame}
              cancel={this.cancelNewGame}
            />
          </div>
        ) : (
          <div>
            <ActiveGames
              activeGames={this.state.activeGames}
              onSelectGame={this.onSelectGame}
            />
            <button onClick={this.setStartNewGame}>New Active Game</button>
          </div>
        )}
        )}
      </div>
    )
  }
}

export default App
