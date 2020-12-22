import "babel-polyfill";
import MegaTicTacToeBoard from "./MegaTicTacToeBoard";
import Board from "./Board";
import EventEmitter from "events";
import utils from './utils'

class GameState extends EventEmitter {
  constructor() {
    super();
    this.board = document.querySelector(".tictactoe-board");
    this.modal = document.querySelector(".modal");
    this.ticTacToeButton = document.querySelector("#ticTacToe");
    this.megaTicTacToeButton = document.querySelector("#megaTicTacToe");
    this.start = document.querySelector("#start");
    this.playAgain = document.querySelector("#playAgain");
    this.winningMessage = document.querySelector(".modal__winner-text");

    this.ticTacToeBoard;
    this.players = [];
    this.playerIndex = 0;
    this.boardType;
  }

  events() {
    this.gameSelection();
  }

  restartEvent() {
    window.location.reload();
    this.ticTacToeButton.parentNode.classList.add(
      "modal__button-holder--is-visible"
    );
    this.megaTicTacToeButton.parentNode.classList.add(
      "modal__button-holder--is-visible"
    );
  }

  gameSelection() {
    if(this.ticTacToeBoard) {
      this.ticTacToeBoard.destroyBoard();
    }
    this.modal.classList.add("modal--is-visible");
    
    this.ticTacToeButton.parentNode.classList.add(
      "modal__button-holder--is-visible"
    );
    this.megaTicTacToeButton.parentNode.classList.add(
      "modal__button-holder--is-visible"
    );
    this.ticTacToeButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.emit("gameInitialized", { boardType: "Regular" });
      this.initializeGame("Regular");
    }); // these clicks can have event emitters
    this.megaTicTacToeButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.emit("gameInitialized", { boardType: "Mega" });
      this.initializeGame("Mega");
    });
  }

  initializeGame(boardType) {
    this.ticTacToeButton.parentNode.classList.remove(
      "modal__button-holder--is-visible"
    );
    this.megaTicTacToeButton.parentNode.classList.remove(
      "modal__button-holder--is-visible"
    );
    if (boardType == "Regular") {
      this.boardType = boardType;
      this.ticTacToeBoard = new Board();
    } else {
      this.boardType = boardType;
      this.ticTacToeBoard = new MegaTicTacToeBoard();
    }
    this.start.parentNode.classList.add("modal__button-holder--is-visible");
    this.start.addEventListener("click", (e) => {
      this.startGame(e);
      this.emit("startGame", { event: e });
      console.log(e);
    });
  }

  startGame(e) {
    if(e) {
      e.preventDefault();
    }
    this.modal.classList.remove("modal--is-visible");
    this.start.parentNode.classList.remove("modal__button-holder--is-visible");
    this.runGame();
  }

  runGame() {} // different across states
  checkValidMove() {} // different across states

  changeTurns() {
    // this.ticTacToeBoard.on("changeTurn", () => {
    console.log(this.currentPlayer, this.playerIndex, this.players.length);
    this.playerIndex = (this.playerIndex + 1) % this.players.length;
    this.currentPlayer = this.players[this.playerIndex];
    console.log(this.currentPlayer, this.playerIndex);
    //})
  }

  gameIsOver(runGameIsOver) {
    let gameOver = false;
    let finalWinner = "";
    this.ticTacToeBoard.on("gameWon", ($event) => {
      gameOver = true;
      finalWinner = $event.mark;
    });
    this.ticTacToeBoard.on("boardIsFull", ($event) => {
      gameOver = true;
      finalWinner = $event.mark;
    });

    if (gameOver) {
      runGameIsOver(finalWinner);
      return true;
    }
    return false;
  }

  runGameIsOver(winner) {
    if (winner) {
      this.restartGame(winner);
    } else {
      this.restartGame("draw");
    }
  }

  async restartGame(winner) {
    // bring back the interface button
    await this.sleep(300);
    this.modal.classList.add("modal--is-visible");
    this.playAgain.parentNode.classList.add("modal__button-holder--is-visible");
    this.playAgain.addEventListener("click", (e) => {
      e.preventDefault();
      this.playAgain.parentNode.classList.remove(
        "modal__button-holder--is-visible"
      );
      this.winningMessage.classList.remove("modal__winner-text--is-visible");
      this.restartEvent();
    });
    this.winningMessage.classList.add("modal__winner-text--is-visible");
    this.winningMessage.innerHTML = `The winner is ${winner}`;
    this.ticTacToeBoard.destroyBoard();
    utils.destroy(this.ticTacToeBoard);
  }

  // a sleep function to simulate a delay in time
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default GameState;
