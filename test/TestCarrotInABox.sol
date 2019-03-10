pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CarrotInABox.sol";

contract TestCarrotInABox {

  CarrotInABox public carrotInABox;
  uint public initialBalance = 1000 finney;

  function beforeEach() public {
    carrotInABox = CarrotInABox(DeployedAddresses.CarrotInABox());
  }

  function testItStartsWithZeroActiveGames() public {
    uint numActiveGames = carrotInABox.getNumActiveGames();
    Assert.equal(numActiveGames, 0, "It should start with 0 active games.");
  }

  function testItCreatesANewActiveGame() public {
    carrotInABox.createNewGame.value(50 finney)(true, "I have the carrot");
    uint numActiveGames = carrotInABox.getNumActiveGames();
    Assert.equal(numActiveGames, 1, "It shows the correct number of active games.");
    uint gameId = carrotInABox.getGameIdFromIndex(0);
    uint betAmount = carrotInABox.getGameBetAmount(gameId);
    Assert.equal(betAmount, 50 finney, "It shows the correct betAmount.");
    string blufferMessage = carrotInABox.getGameBlufferMessage(gameId);
    Assert.equal(blufferMessage, "I have the carrot", "It shows the correct blufferMessage.");
  }

  function testItCompletesAnActiveWinningGame() public {
    carrotInABox.createNewGame.value(50 finney)(true, "I have carrot");
    uint gameId = carrotInABox.getGameIdFromIndex(0);
    carrotInABox.concludeGame.value(50 finney)(gameId, true);
    Assert.equal(address(this).balance, 949 finney, "It correctly transfers winnings.");
  }

  function testItCompletesAnActiveLosingGame() public {
    carrotInABox.createNewGame.value(50 finney)(true, "I have carrot");
    uint gameId = carrotInABox.getGameIdFromIndex(0);
    carrotInABox.concludeGame.value(50 finney)(gameId, false);
    Assert.equal(address(this).balance, 948 finney, "It correctly transfers winnings.");
  }
  
  function testItCompletesAnActiveLosingGame() public {
    uint devFee = carrotInABox.getDevFee(false);
    Assert.equal(devFee, 1 ether - 948 finney, "It correctly returns who won.");
  }

  function() external payable { }

}