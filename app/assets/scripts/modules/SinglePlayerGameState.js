import GameState from './GameState';
import NonPlayerCharacter from './NonPlayerCharacter';

class SinglePlayerGameState extends GameState {
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
  
  export default SinglePlayerGameState;