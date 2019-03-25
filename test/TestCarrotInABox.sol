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
    Assert.equal(gameId, 0, "It gets correct gameId");
    uint betAmount = carrotInABox.getGameBetAmount(gameId);
    Assert.equal(betAmount, 50 finney, "It shows the correct betAmount.");
  }

  function testItCompletesAnActiveWinningGame() public {
    uint gameId = carrotInABox.getGameIdFromIndex(0);
    carrotInABox.concludeGame.value(50 finney)(gameId, true);
    Assert.equal(address(this).balance, 999 finney, "It correctly transfers winnings.");
    uint numActiveGames = carrotInABox.getNumActiveGames();
    Assert.equal(numActiveGames, 0, "It shows the correct number of active games.");
  }

  function testItCompletesAnActiveLosingGame() public {
    carrotInABox.createNewGame.value(50 finney)(true, "I have carrot");
    uint gameId = carrotInABox.getGameIdFromIndex(0);
    carrotInABox.concludeGame.value(50 finney)(gameId, false);
    Assert.equal(address(this).balance, 998 finney, "It correctly transfers winnings.");
  }
  
  function testItReplacesOldGames() public {
    uint startActiveGames = carrotInABox.getNumActiveGames();
    Assert.equal(startActiveGames, 0, "It should start with 0 active games.");
    carrotInABox.createNewGame.value(50 finney)(true, "I have carrot");
    carrotInABox.createNewGame.value(100 finney)(true, "I have carrot");
    carrotInABox.createNewGame.value(200 finney)(true, "I have carrot");
    uint numActiveGames = carrotInABox.getNumActiveGames();
    Assert.equal(numActiveGames, 3, "It should have 3 active games.");
    uint gameId = carrotInABox.getGameIdFromIndex(1);
    carrotInABox.concludeGame.value(100 finney)(gameId, false);
    gameId = carrotInABox.getGameIdFromIndex(1);
    // carrotInABox.concludeGame.value(200 finney)(carrotInABox.getGameIdFromIndex(1), false);
    // carrotInABox.createNewGame.value(60 finney)(true, "I have carrot");
    // carrotInABox.createNewGame.value(70 finney)(true, "I have carrot");
    // uint betAmount = carrotInABox.getGameBetAmount(carrotInABox.getGameIdFromIndex(1));
    // Assert.equal(betAmount, 60 finney, "It shows the correct betAmount.");  
  }

  // function testItGetsCorrectAmountOfDevHoldings() public {
  //   uint devHoldings = carrotInABox.getDevHoldings();
  //   Assert.equal(devHoldings, 1 ether - 948 finney, "It correctly transfers dev fees.");
  // }

  function() external payable { }

}