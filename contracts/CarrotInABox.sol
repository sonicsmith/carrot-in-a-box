pragma solidity ^0.5.0;

contract CarrotInABox {

  event GameOutcome(
    bool playerWon,
    bool error
  );

  event NewGameId(
    uint newId
  );

  struct Game {
    uint gameId;
    address payable blufferAddress;
    uint betAmount;
    bool blufferHasCarrot;
    string blufferMessage;
  }

  Game[] activeGames;
  address payable owner;
  uint gameCount;

  constructor() public {
    owner = msg.sender;
    gameCount = 0;
  }


    /**
    * @title SafeMath
    * @dev Unsigned math operations with safety checks that revert on error
    */
    /**
     * @dev Multiplies two unsigned integers, reverts on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b);
        return c;
    }

    /**
     * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        return c;
    }

    /**
     * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;
        return c;
    }

    /**
     * @dev Adds two unsigned integers, reverts on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);
        return c;
    }

  /**
    * End of Safe Math
  */


  function getNumActiveGames() public view returns (uint) {
    uint numGames = 0;
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].blufferAddress != address(0)) {
        numGames = add(numGames, 1);
      }
    }
    return numGames;
  }

  function getGameIdFromIndex(uint index) public view returns (uint) {
    return activeGames[index].gameId;
  }

  function getGameBetAmount(uint gameId) public view returns (uint) {
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].gameId == gameId) {
        return activeGames[index].betAmount;
      }
    }
    return 0;
  }

  function getGameBlufferMessage(uint gameId) public view returns (string memory) {
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].gameId == gameId) {
        return activeGames[index].blufferMessage;
      }
    }
    return "";
  }

  function createNewGame(bool blufferHasCarrot, string memory blufferMessage) public payable {
    Game memory newGame = Game(gameCount, msg.sender, msg.value, blufferHasCarrot, blufferMessage);
    emit NewGameId(gameCount);
    gameCount = add(gameCount, 1);
    // 
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].blufferAddress == address(0)) {
        activeGames[index] = newGame;
        return;
      }
    }
    activeGames.push(newGame);
  }

  function concludeGame(uint gameId, bool swapBox) public payable {
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].gameId == gameId) {
        // Assert that our paid amount matches game bet amount
        require(msg.value == activeGames[index].betAmount);
        // payout is twice the betAmount - 1% dev fees
        uint totalBetAmount = mul(activeGames[index].betAmount, 2);
        uint devFees = div(totalBetAmount, 100);
        uint payout = sub(totalBetAmount, devFees);
        bool playerSwappedCorrectly = activeGames[index].blufferHasCarrot && swapBox;
        bool playerKeptCorrectly = !activeGames[index].blufferHasCarrot && !swapBox;
        if (playerSwappedCorrectly || playerKeptCorrectly) {
          // Guesser has won, bluffer has lost
          emit GameOutcome(true, false);
          msg.sender.transfer(payout);
          activeGames[index].blufferAddress = address(0);
          return;
        } else {
          // Guesser has lost, bluffer has won
          emit GameOutcome(false, false);
          activeGames[index].blufferAddress.transfer(payout);
          activeGames[index].blufferAddress = address(0);
          return;
        }
      }
    }
    // If we are here, the player tried to conclude old game
    emit GameOutcome(false, true);
  }

  function getDevHoldings() public view returns (uint) {
    require(msg.sender == owner);
    uint totalInGames = 0;
    for (uint index = 0; index < activeGames.length; index++) {
      totalInGames = add(totalInGames, activeGames[index].betAmount);
    }
    uint amplifiedAmount = mul(totalInGames, 200);
    uint amountInGames = sub(amplifiedAmount, div(amplifiedAmount, 100));
    uint devFeeTotal = sub(address(this).balance, amountInGames);
    return devFeeTotal;
  }

  function transferDevHoldings() public payable {
    require(msg.sender == owner);
    uint devFeeTotal = getDevHoldings();
    owner.transfer(devFeeTotal);
  }

  function() external payable { }

}
