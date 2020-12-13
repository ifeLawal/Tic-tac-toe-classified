import 'babel-polyfill';
import TicTacToeBoard from "./LocalTicTacToeBoard";
import OnlineTicTacToeBoard from "./OnlineTicTacToeBoard";

class GameState {
  // you might need sockets here???
  constructor() {
    this.modal = document.querySelector(".modal");
    this.start = document.querySelector("#start");
    this.winningMessage = document.querySelector(".modal__winner-text");
    this.interface = "";

    this.currentTicTacToeGame;
  }

  initializeGame() {
    this.currentTicTacToeGame = new TicTacToeBoard();
    // sockets will have to activate this on the other game state
    this.start.addEventListener("click", (e) => {
      e.preventDefault();
      this.startGame();
      // window.socket.emit()
    });
    this.modal.classList.add("modal--is-visible");

  }

  startGame() {
    this.modal.classList.remove("modal--is-visible");
    // TODO create cleaner way of showing board that doesn't involve destroying a board
    this.currentTicTacToeGame.destroyBoard();

    this.currentTicTacToeGame = new TicTacToeBoard();
    this.checkGameState();
  }

  async restartGame() {
    // bring back the interface button
    await this.sleep(300);
    this.start.innerHTML = "Play Again";
    this.winningMessage.classList.add("modal__winner-text--is-visible");
    this.winningMessage.innerHTML = `The winner is ${this.currentTicTacToeGame.getWinner()}`;
    this.currentTicTacToeGame.destroyBoard();
    this.events();
  }

  // each game has a different way of evaluating this
  checkGameState() {}

  // a sleep function to simulate a delay in time
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default GameState;
