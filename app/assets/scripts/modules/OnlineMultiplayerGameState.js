import GameState from "./GameState";
import OnlineTicTacToeBoard from "./OnlineTicTacToeBoard";

class OnlineMultiplayerGameState extends GameState {
  constructor({mark, socketId}) {
    super();
    this.mark = mark;
    this.currentPlayer = socketId;

    this.initializeGame();
  }

  initializeGame() {
    this.currentTicTacToeGame = new OnlineTicTacToeBoard(
      this.mark,
      this.currentPlayer
    );
    // sockets will have to activate this on the other game state
    window.socket.on("gameStarted", () => {
      console.log(window.socket, " received a message.");
      this.startGame();
      this.start.removeEventListener("click");
    });
    this.start.addEventListener("click", (e) => {
      e.preventDefault();
      window.socket.emit("gameStarted");
      console.log(window.socket, " delivered a message.");
      this.startGame();
      // window.socket.emit()
    });
  }

  // if socket 1 turn, socket 2 can not move
  // choose random socket to start first
  // send socket turn to cluster board
  // if player1Turn, socket1 can play, socket2 can not play
}

export default OnlineMultiplayerGameState;
