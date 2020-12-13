import OnlineCluster from "./OnlineCluster";
import EventEmitter from "events";
import TicTacToeBoard from "./TicTacToeBoard";

class OnlineTicTacToeBoard {
  constructor(mark, currentPlayer) {
    // super();
    this.board = document.querySelector(".tictactoe-board");

    this.boardArray = [];

    this.clusterBoard = new OnlineCluster(mark, currentPlayer);

    this.injectHTML();
    this.runGame();
  }

  injectHTML() {
    this.board.appendChild(this.clusterBoard.getClusterBoard());
  }

  // convert 1 dimensional array into 2 dimensional representation

  // set player turn

  // swap turns
  swapTurns() {

  }

  // check matches

  // check if game is over

  // runGame
  runGame() {
    this.clusterBoard.on("clusterboardClicked", () => {

      this.swapTurns();
      // this.clusterBoard.setCurrentPlayer(this.currentPlayer);
      this.clusterBoard.setBoardPlayer(this.currentPlayer);
      // console.log(
      //   "swapped turns",
      //   `the current player is ${this.currentPlayer}`
      // );
    });

    this.clusterBoard.on("gameFinished", () => {
      
      this.emit("boardGameFinished");
    })
  }

  destroyBoard() {
    while (this.board.firstChild) {
      this.board.removeChild(this.board.lastChild);
    }
  }

  getWinner() {
    return this.clusterBoard.getWinner();
  }
}

export default OnlineTicTacToeBoard;