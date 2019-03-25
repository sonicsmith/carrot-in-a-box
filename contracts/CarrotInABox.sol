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
    address payable blufferAddress;
    uint betAmount;
    bool blufferHasCarrot;
    string blufferMessage;
  }

  mapping(uint => Game) games;
  uint[] activeGames;

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

  function getActiveGamesIds() public view returns (uint[] memory) {
    uint[] memory gameIds = new uint[](activeGames.length);
    for (uint i = 0; i < activeGames.length; i++) {
      gameIds[i] == activeGames[i];
    }
    return gameIds;
  }

  function getGameBetAmount(uint gameId) public view returns (uint) {
    games[gameId].betAmount;
  }

  function getGameBlufferMessage(uint gameId) public view returns (string memory) {
    games[gameId].blufferMessage;
  }

  function createNewGame(bool blufferHasCarrot, string memory blufferMessage) public payable {
    Game memory newGame = Game(msg.sender, msg.value, blufferHasCarrot, blufferMessage);
    emit NewGameId(gameCount);
    gameCount = add(gameCount, 1);
    games[gameCount] = newGame;
    activeGames.push(gameCount);
  }

  function concludeGame(uint gameId, bool swapBox) public payable {
    // Assert that our paid amount matches game bet amount
    require(msg.value == games[gameId].betAmount);
    // payout is twice the betAmount - 1% dev fees
    uint totalBetAmount = mul(games[gameId].betAmount, 2);
    uint devFees = div(totalBetAmount, 100);
    uint payout = sub(totalBetAmount, devFees);
    bool playerSwappedCorrectly = games[gameId].blufferHasCarrot && swapBox;
    bool playerKeptCorrectly = !games[gameId].blufferHasCarrot && !swapBox;
    if (playerSwappedCorrectly || playerKeptCorrectly) {
      // Guesser has won, bluffer has lost
      emit GameOutcome(true, false);
      msg.sender.transfer(payout);
    } else {
      // Guesser has lost, bluffer has won
      emit GameOutcome(false, false);
      games[gameId].blufferAddress.transfer(payout);
    }
    uint index;
    for (uint i = 0; i < activeGames.length; i++) {
      if (activeGames[i] == gameId) {
        index = i;
        break;
      }
    }
    activeGames[index] = activeGames[sub(activeGames.length, 1)];
    activeGames.length = sub(activeGames.length, 1);
  }

  function getDevHoldings() public view returns (uint) {
    require(msg.sender == owner);
    uint totalInGames = 0;
    for (uint index = 0; index < activeGames.length; index++) {
      totalInGames = add(totalInGames, games[activeGames[index]].betAmount);
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
