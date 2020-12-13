import Cluster from "./Cluster";
import EventEmitter from "events";

class LocalTicTacToeBoard extends EventEmitter {
  constructor() {
    super();
    this.board = document.querySelector(".tictactoe-board");

    this.boardArray = [];
    this.currentPlayer = "x";
    this.clusterBoard = new Cluster(this.currentPlayer);

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
    if (this.currentPlayer == "x") {
      this.currentPlayer = "o";
    } else {
      this.currentPlayer = "x";
    }
  }

  // check matches

  // check if game is over

  // runGame
  runGame() {
    this.clusterBoard.on("clusterboardClicked", () => {

      this.swapTurns();
      this.clusterBoard.setCurrentPlayer(this.currentPlayer);
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

export default LocalTicTacToeBoard;
