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
    uint index = carrotInABox.createNewGame.value(50 finney)(true, "I have the carrot");
    Assert.equal(index, 0, "It returns the correct index.");
    uint numActiveGames = carrotInABox.getNumActiveGames();
    Assert.equal(numActiveGames, 1, "It shows the correct number of active games.");
    address sender = carrotInABox.getGameBlufferAddress(0);
    uint betAmount = carrotInABox.getGameBetAmount(sender);
    Assert.equal(betAmount, 50 finney, "It shows the correct betAmount.");
    bytes32 blufferMessage = carrotInABox.getGameBlufferMessage(sender);
    Assert.equal(blufferMessage, "I have the carrot", "It shows the correct blufferMessage.");
  }

  function testItCompletesAnActiveWinningGame() public {
    carrotInABox.createNewGame.value(50 finney)(true, "I have carrot");
    address sender = carrotInABox.getGameBlufferAddress(0);
    address payable bluffersAddress = address(uint160(sender));
    uint code = carrotInABox.concludeGame.value(50 finney)(bluffersAddress, true);
    Assert.equal(code, 1, "It correctly returns who won.");
    Assert.equal(bluffersAddress.balance, 949 finney, "It correctly transfers winnings.");
  }

  function testItCompletesAnActiveLosingGame() public {
    carrotInABox.createNewGame.value(50 finney)(true, "I have carrot");
    address sender = carrotInABox.getGameBlufferAddress(0);
    address payable bluffersAddress = address(uint160(sender));
    uint code = carrotInABox.concludeGame.value(50 finney)(bluffersAddress, false);
    Assert.equal(code, 0, "It correctly returns who won.");
    Assert.equal(bluffersAddress.balance, 948 finney, "It correctly transfers winnings.");
  }

  function() external payable { }

}