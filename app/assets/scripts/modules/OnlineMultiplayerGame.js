import GameState from "./GameState";

class OnlineMultiplayerGame extends GameState {
  constructor(players) {
    super();
    this.players = players;
    this.currentPlayer = players[0];
    this.playerIndex = 0;

    this.events();
    this.notifySocket();
  }

  notifySocket() {
    this.once("gameInitialized", ($event) => {
      window.socket.emit("gameInitialized", { boardType: $event.boardType });
    });

    window.socket.on("gameInitialized", (data) => {
      this.initializeGame(data.boardType);
    });

    this.once("startGame", ($event) => {
      // console.log($event.event);
      window.socket.emit("startGame", $event);
    });

    window.socket.on("startGame", (data) => {
      this.startGame();
    });
  }

  runGame() {
    this.ticTacToeBoard.lookActive();
    this.ticTacToeBoard.activate();
    this.ticTacToeBoard.on("validMove", ($event) => {
      if (this.checkValidMove()) {
        window.socket.emit("makeMove", {
          cellIndex: $event.cellIndex,
          mark: this.currentPlayer.mark,
        });
        this.ticTacToeBoard.emit("makeMove", {
          cellIndex: $event.cellIndex,
          mark: this.currentPlayer.mark,
        });
      } else {
        // not your turn yet
      }
    });
    this.ticTacToeBoard.on("hover", ($event) => {
      window.socket.emit("validHover", {
        cellIndex: $event.cellIndex,
        mark: this.currentPlayer.mark,
      });
      this.ticTacToeBoard.emit("validHover", {
        cellIndex: $event.cellIndex,
        mark: this.currentPlayer.mark,
      });
    });
    this.ticTacToeBoard.on("removeHover", ($event) => {
      window.socket.emit("removeHover", $event);
    });

    window.socket.on("hover", (data) => {
      this.ticTacToeBoard.emit("validHover", {
        cellIndex: data.cellIndex,
        mark: data.mark,
      });
    });

    this.ticTacToeBoard.on("changeTurn", () => {
      this.changeTurns();
    })

    window.socket.on("validRemoveHover", (data) => {
      this.ticTacToeBoard.emit("validRemoveHover", {
        cellIndex: data.cellIndex,
        mark: data.mark,
      });
    });

    window.socket.on("reconcileMove", (data) => {
      // console.count();
      this.ticTacToeBoard.emit("makeMove", {
        cellIndex: data.cellIndex,
        mark: data.mark,
      });
    });

    window.socket.on("reconcilePlayerTurn", () => {
      // console.log("change Turns");
      this.changeTurns();
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
  }

  checkValidMove() {
    // console.log({currentPlayer: this.currentPlayer.socketId}, {windowSocket: window.socket.id});
    return this.currentPlayer.socketId == window.socket.id;
  }
}

export default OnlineMultiplayerGame;
