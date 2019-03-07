pragma solidity ^0.5.0;

/*
  TODO: Major issue, how about one user wants to have multiple games?
*/


contract CarrotInABox {

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
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

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
    return activeGames.length;
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

  // Creates new game and returns index of the game
  function createNewGame(bool blufferHasCarrot, string memory blufferMessage) public payable returns (uint) {
    Game memory newGame = Game(gameCount, msg.sender, msg.value, blufferHasCarrot, blufferMessage);
    gameCount++;
    activeGames.push(newGame);
    return activeGames.length - 1;
  }

  function removeGame(uint index) internal {
    for (uint i = index; i<activeGames.length - 1; i++){
      activeGames[i] = activeGames[i + 1];
    }
    delete activeGames[activeGames.length - 1];
    activeGames.length--;
  }

  // Returns 0 if can't find game
  function concludeGame(uint gameId, bool swapBox) public payable returns (uint) {
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].gameId == gameId) {
        // Assert that our paid amount matches game bet amount
        require(msg.value == activeGames[index].betAmount);
        // payout is twice the betAmount - 1% dev fees
        uint totalBetAmount = mul(activeGames[index].betAmount, 2);
        uint devFees = div(totalBetAmount, 100);
        uint payout = sub(totalBetAmount, devFees);
        if (activeGames[index].blufferHasCarrot && swapBox) {
          // Guesser has won, bluffer has lost
          msg.sender.transfer(payout);
          removeGame(index);
          return 1;
        } else {
          // Guesser has lost, bluffer has won
          activeGames[index].blufferAddress.transfer(payout);
          removeGame(index);
          return 0;
        }
      }
    }
    return 255;
  }

  function getDevFee(bool shouldTransfer) public payable returns (uint) {
    require(msg.sender == owner);
    uint totalInGames = 0;
    for (uint index = 0; index < activeGames.length; index++) {
      totalInGames = add(totalInGames, activeGames[index].betAmount);
    }
    uint amplifiedAmount = mul(totalInGames, 200);
    uint amountInGames = sub(amplifiedAmount, div(amplifiedAmount, 100));
    uint devFeeTotal = sub(address(this).balance, amountInGames);
    if (shouldTransfer) {
      owner.transfer(devFeeTotal);
    }
    return devFeeTotal;
  }

  function() external payable { }

}
