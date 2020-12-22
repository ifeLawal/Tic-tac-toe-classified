import Board from "./Board";
import utils from "./utils";
import EventEmitter from "events";

const LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD = 9;
const LENGTH_OF_TIC_TAC_TOE_BOARD = 3;

class MegaTicTacToeBoard extends EventEmitter {
  constructor() {
    super();
    this.board = document.querySelector(".tictactoe-board");
    this.boards = [];

    this.megaBoardArray;
    this.boardOrder = this.createBoardOrder();
    this.boardIndex = 0;
    this.currentBoard;

    this.boardOrder = [0,1,2,3,4,5,6,7,8];
    this.setupGame();  
  }

  setupGame() {
    this.createBoards();
    this.megaBoardArray = this.createTwoDBoard();
    this.boardOrder = utils.shuffle(this.boardOrder);
    this.currentBoard = this.boardOrder[this.boardIndex];
  }
  
  lookActive() {
    this.boards[this.currentBoard].lookActive();
  }

  createTwoDBoard() {
    let outerArr = [];
    for(let i = 0; i < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD; i++) {
        outerArr.push(new Array(LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD));
        outerArr[i].fill('');
    }
    return outerArr;
  }

  createBoards() {
    for(let i = 0; i < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD;i++) {
      let board = new Board();
      this.boards.push(board);
    }
  }

  createBoardOrder() {
    let board_order = [0,1,2,3,4,5,6,7,8];
    return utils.shuffle(board_order);
  }

  activate() {
    this.on("makeMove", () => {

    });

    this.boards.forEach((board, index) => {
      board.on("validMove", ($event) => {
        if(this.checkIfMoveIsValid(index)) {
          this.emit("validMove", $event.cellIndex);
        } else {
          // invalid move
        }
      })
    })
  }

  checkIfMoveIsValid(index) {
    return index == this.boardIndex;
  }

  makeMove(cellIndex, mark) {
    this.boards[this.boardIndex].makeMove(cellIndex, mark);
  }

  runGame() {
    this.boards[this.boardIndex].runGame();
    this.boards.forEach(board => {
      board.on("click", () => {
        
      });
    });
  }
  
  checkDiagonalMatches() {}

  checkVerticalMatches() {}

  checkHorizontalMatches() {}

  // Front end actions
  destroyBoard() {
    while (this.board.firstChild) {
      this.board.removeChild(this.board.lastChild);
    }
  }


}

export default MegaTicTacToeBoard;
