pragma solidity ^0.5.0;

contract CarrotInABox {

  struct Game {
    address blufferAddress;
    uint betAmount;
    bool blufferHasCarrot;
    bytes32 blufferMessage;
  }

  Game[] activeGames;
  address payable owner;

  constructor() public {
    owner = msg.sender;
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

  function getGameBlufferAddress(uint index) public view returns (address) {
    return activeGames[index].blufferAddress;
  }

  function getGameBetAmount(address blufferAddress) public view returns (uint) {
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].blufferAddress == blufferAddress) {
        return activeGames[index].betAmount;
      }
    }
    return 0;
  }

  function getGameBlufferMessage(address blufferAddress) public view returns (bytes32) {
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].blufferAddress == blufferAddress) {
        return activeGames[index].blufferMessage;
      }
    }
    return "";
  }

  // Creates new game and returns index of the game
  function createNewGame(bool blufferHasCarrot, bytes32 blufferMessage) public payable returns (uint) {
    Game memory newGame = Game(msg.sender, msg.value, blufferHasCarrot, blufferMessage);
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
  function concludeGame(address payable blufferAddress, bool swapBox) public payable returns (uint) {
    for (uint index = 0; index < activeGames.length; index++) {
      if (activeGames[index].blufferAddress == blufferAddress) {
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
          blufferAddress.transfer(payout);
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
