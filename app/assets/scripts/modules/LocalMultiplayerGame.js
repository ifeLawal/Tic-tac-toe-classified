import GameState from "./GameState";

class LocalMultiplayerGame extends GameState {
  constructor() {
    super();

    this.players = [
      { name: "player1", mark: "x", id: "player1" },
      { name: "player2", mark: "o", id: "player2" },
    ];

    this.currentPlayer = this.players[this.playerIndex];
    this.events();
  }

  runGame() {
    if(this.boardType == "Mega") {
      this.ticTacToeBoard.setupGame();
    } else {
      this.ticTacToeBoard.lookActive();
      this.ticTacToeBoard.activate();
    }
    this.ticTacToeBoard.on("validMove", ($event) => {
      
      this.ticTacToeBoard.emit("makeMove", {
        cellIndex: $event.cellIndex,
        mark: this.currentPlayer.mark,
      });
    });
    this.ticTacToeBoard.on("hover", ($event) => {
      this.ticTacToeBoard.setBoardHover(this.currentPlayer.mark);

    });
    let gameOver = false;
    let finalWinner = "";

    this.ticTacToeBoard.on("gameWon", ($event) => {
      gameOver = true;
      finalWinner = $event.mark;
      this.runGameIsOver(finalWinner);
    });
    this.ticTacToeBoard.on("boardIsFull", ($event) => {
      gameOver = true;
      finalWinner = $event.mark;
      this.runGameIsOver(finalWinner);
    });
    this.ticTacToeBoard.on("changeTurn", () => {
      console.log("turn change");
      console.log(this.currentPlayer, this.playerIndex, this.players.length);
      this.playerIndex = (this.playerIndex + 1) % this.players.length;
      this.currentPlayer = this.players[this.playerIndex];
      console.log(this.currentPlayer, this.playerIndex);
      // this.changeTurns();
    });
    this.ticTacToeBoard.on("test", () => {
      console.log("Are we running twice");
    });
  }

  checkIfMoveIsValid(index) {
    return true;
  }
}

export default LocalMultiplayerGame;
