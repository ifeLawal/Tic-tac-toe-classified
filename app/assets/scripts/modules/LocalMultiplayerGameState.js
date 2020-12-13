import EventEmitter from "events";
import GameState from './GameState'

class LocalMultiplayerGameState extends GameState {
  constructor() {
    super();

    this.initializeGame();
  }

   checkGameState() {
    this.currentTicTacToeGame.on("boardGameFinished", () => {
      console.log("restart reached!");
      this.restartGame();
    });
  }
}

export default LocalMultiplayerGameState;
