import 'babel-polyfill';
import EventEmitter from "events";
import TicTacToeBoard from "./TicTacToeBoard";

class GameState extends EventEmitter {
  constructor() {
    super();
    this.modal = document.querySelector(".modal");
    this.start = document.querySelector("#start");
    this.winningMessage = document.querySelector('.modal__winner-text');
    this.interface = "";

    this.currentTicTacToeGame;
  }

  initializeGame() {
    this.currentTicTacToeGame = new TicTacToeBoard();
    this.modal.classList.add("modal--is-visible");
    this.start.addEventListener("click", (e) => {
      this.startGame(e);
      // window.socket.emit()
    });
  }

  startGame(e) {
    e.preventDefault();
    this.modal.classList.remove("modal--is-visible");
    this.currentTicTacToeGame.destroyBoard();
    // this.start.removeEventListener("click", this.startGame);
    this.currentTicTacToeGame = new TicTacToeBoard();
    this.checkGameState();
  }

  async restartGame() {
    // bring back the interface button
    await this.sleep(300);
    this.start.innerHTML = "Play Again";
    this.winningMessage.classList.add('modal__winner-text--is-visible');
    this.winningMessage.innerHTML = `The winner is ${this.currentTicTacToeGame.getWinner()}`;
    this.currentTicTacToeGame.destroyBoard();
    this.events();
  }

   checkGameState() {
    this.currentTicTacToeGame.on("boardGameFinished", () => {
      this.restartGame();
    });
  }

  // a sleep function to simulate a delay in time
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default GameState;
