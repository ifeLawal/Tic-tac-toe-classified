import EventEmitter from "events";
import Cell from "./Cell";

const LENGTH_OF_TIC_TAC_TOE_BOARD = 3;

class Board extends EventEmitter {
  constructor() {
    super();
    this.board = document.querySelector(".tictactoe-board");
    this.boardArray = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.cells = [];
    this.ticTacToeBoard = this.createBoard();

    this.winner;

    this.matches = {
      x: [],
      o: [],
    };

    this.injectHTML();
  }

  injectHTML() {
    this.board.appendChild(this.ticTacToeBoard);
  }

  createBoard() {
    let div = document.createElement("div");
    div.classList.add("tictactoe-board__cluster");
    div.setAttribute("data-cluster", "");
    for (let i = 0; i < 9; i++) {
      let newCell = new Cell();
      div.appendChild(newCell.getCell());
      this.cells.push(newCell);
    }

    return div;
  }

  activate() {
    this.cells.forEach((cell, index) => {
      cell.on("click", () => {
        
        if (this.checkIfMoveIsValid(index)) {
          this.emit("validMove", { cellIndex: index });
        } else {
          // invalid move, signal the player with a front end reaction
        }
      });
      cell.on("hover", () => {
        this.emit("hover", { cellIndex: index });
      });
      cell.on("removeHover", () => {
        this.emit("removeHover", { cellIndex: index });
      });
    });

    this.on("makeMove", ($event) => {
      // console.log({event: $event});
      this.fillBoard($event.cellIndex, $event.mark);
      this.cells[$event.cellIndex].fillCell($event.mark);
      if(this.checkForWin() == true) {
        this.emit("gameWon", {mark: $event.mark});
      } else if (this.checkIfBoardIsFull()) {
        this.emit("boardIsFull", {mark: ""});
        // this.makeMove($event.index, $event.mark);
      } else {
        this.emit("changeTurn");
      }
    });

    this.on("validHover", ($event) => {
      this.setBoardHover($event.mark);
      if($event.cellIndex) {
        this.cells[$event.cellIndex].hoverCell()
      }
    });

    this.on("validRemoveHover", ($event) => {
      this.cells[$event.cellIndex].removeHoverCell();
    })
  }

  setBoardHover(mark) {
    if (mark == "x") {
      this.board.classList.remove(
        "tictactoe-board__cluster--circle-is-visible"
      );
      this.board.classList.add("tictactoe-board__cluster--x-is-visible");
    } else {
      this.board.classList.add("tictactoe-board__cluster--circle-is-visible");
      this.board.classList.remove("tictactoe-board__cluster--x-is-visible");
    }
  }

  lookActive() {
    this.ticTacToeBoard.classList.add("tictactoe-board__cluster--is-active");
  }

  lookInactive() {
    this.ticTacToeBoard.classList.remove("tictactoe-board__cluster--is-active");
    this.ticTacToeBoard.classList.remove("tictactoe-board__cluster--circle-is-visible");
    this.ticTacToeBoard.classList.remove("tictactoe-board__cluster--x-is-visible");
  }

  checkForWin() {
    let win = this.checkDiagonalMatches() || this.checkHorizontalMatches() || this.checkVerticalMatches(); 

    this.colorMatch();
    return win;
  }

  // diagonal matches
  checkDiagonalMatches() {
    let foundBackSlashMatch = true;
    let foundForwardSlashMatch = true;
    let diagonalBackSlashMark = this.boardArray[0][0];
    let diagonalForwardSlashMark = this.boardArray[0][2];
    let backSlashMatchIndices = [0];
    let forwardSlashMatchIndices = [2];

    for (let row = 1; row < this.boardArray.length; row++) {
      let end = this.boardArray.length - 1;
      if (
        diagonalBackSlashMark == "" ||
        diagonalBackSlashMark != this.boardArray[row][row]
      ) {
        foundBackSlashMatch = false;
        backSlashMatchIndices = [];
      } else {
        let cellIndex = this.convertBoardLocationToIndex(row, row);
        backSlashMatchIndices.push(cellIndex);
      }
      if (
        diagonalForwardSlashMark == "" ||
        diagonalForwardSlashMark != this.boardArray[row][end - row]
      ) {
        foundForwardSlashMatch = false;
        forwardSlashMatchIndices = [];
      } else {
        let cellIndex = this.convertBoardLocationToIndex(row, end - row);
        forwardSlashMatchIndices.push(cellIndex);
      }
    }

    if (forwardSlashMatchIndices.length == 3) {
      this.matches[diagonalForwardSlashMark].push(forwardSlashMatchIndices);
    }
    if (backSlashMatchIndices.length == 3) {
      this.matches[diagonalBackSlashMark].push(backSlashMatchIndices);
    }

    return foundBackSlashMatch || foundForwardSlashMatch;
  };

  // vertical matches
  checkVerticalMatches() {
    let foundMatch;
    let matchIndices = [];

    for (let col = 0; col < this.boardArray[0].length; col++) {
      let firstMark = this.boardArray[0][col];
      foundMatch = true;
      matchIndices.push(this.convertBoardLocationToIndex(0, col));
      // console.log({firstMark});
      for (let row = 1; row < this.boardArray.length; row++) {
        if (firstMark == "" || firstMark != this.boardArray[row][col]) {
          foundMatch = false;
          matchIndices = [];
          break;
        }
        matchIndices.push(this.convertBoardLocationToIndex(row, col));
      }
      if (foundMatch == true) {
        this.matches[firstMark].push(matchIndices);
        return foundMatch;
      }
    }

    return foundMatch;
  };

  // horizontal matches
  checkHorizontalMatches() {
    let foundMatch;
    let matchIndices = [];

    for (let row = 0; row < this.boardArray.length; row++) {
      let firstMark = this.boardArray[row][0];
      foundMatch = true;
      matchIndices.push(this.convertBoardLocationToIndex(row, 0));
      // console.log({firstMark});
      for (let col = 1; col < this.boardArray[0].length; col++) {
        if (firstMark == "" || firstMark != this.boardArray[row][col]) {
          foundMatch = false;
          matchIndices = [];
          break;
        }
        matchIndices.push(this.convertBoardLocationToIndex(row, col));
      }
      if (foundMatch == true) {
        this.matches[firstMark].push(matchIndices);
        return foundMatch;
      }
    }

    return foundMatch;
  };
  // convert single cell array value to
  convertIndexToBoardLocation(val) {
    let boardx = 0;
    let boardy = 0;

    if (val % (LENGTH_OF_TIC_TAC_TOE_BOARD - 1) == 0) {
      boardx = Math.floor(val / LENGTH_OF_TIC_TAC_TOE_BOARD);
      boardy = val % LENGTH_OF_TIC_TAC_TOE_BOARD;
    } else {
      boardx = Math.floor(val / LENGTH_OF_TIC_TAC_TOE_BOARD);
      boardy = val % LENGTH_OF_TIC_TAC_TOE_BOARD;
    }

    return [boardx, boardy];
  }

  // transform the 2D javascript array representation of the board
  // into the single array index UI system
  convertBoardLocationToIndex(row, col) {
    // let clusterIndex = 0;
    let cellIndex = 0;

    // clusterIndex = Math.floor(row / LENGTH_OF_TIC_TAC_TOE_BOARD) * LENGTH_OF_TIC_TAC_TOE_BOARD + Math.floor(col / LENGTH_OF_TIC_TAC_TOE_BOARD);
    cellIndex =
      (row % LENGTH_OF_TIC_TAC_TOE_BOARD) * 3 +
      (col % LENGTH_OF_TIC_TAC_TOE_BOARD);

    return cellIndex;
  }

  makeMove(cellIndex, mark) {
    this.fillBoard(cellIndex, mark);
    this.cells[cellIndex].fillCell(mark);
  }

  fillBoard(cellIndex, mark) {
    let [boardRow, boardCol] = this.convertIndexToBoardLocation(cellIndex);
    // console.log(this.boardArray[boardRow, boardCol], boardRow, boardCol, mark, cellIndex);
    this.boardArray[boardRow][boardCol] = mark;
  }

  // Front end actions
  destroyBoard() {
    console.log(this.board);
    while (this.board.firstChild) {
      this.board.removeChild(this.board.lastChild);
    }
    
    this.boardArray = [];
    this.cells = [];
    console.log(this.board);
  }

  colorMatch() {
    let matches = this.matches;
    // console.log({ matches });
    for (let marker in matches) {
      //   console.log(marker);
      let matchesArr = matches[marker];
      for (let i = 0; i < matchesArr.length; i++) {
        for (let j = 0; j < matchesArr[i].length; j++) {
          if (marker == "x") {
            let cellIndex = matchesArr[i][j];
            // console.log({ cellIndex }, `cell ${this.cells[cellIndex]}`);
            this.cells[cellIndex].colorCell("red");
          } else {
            let cellIndex = matchesArr[i][j];
            // console.log({ cellIndex }, `cell ${this.cells[cellIndex]}`);
            this.cells[cellIndex].colorCell("red");
          }
        }
      }
    }
  }

  topMark() {
    let topMark;
    let maxMatches = 0;
    for (let mark in this.matches) {
      if (this.matches[mark].length > maxMatches) {
        maxMatches = this.matches[mark].length;
        topMark = mark;
      }
    }

    return topMark;
  }

  checkIfMoveIsValid(cellIndex) {
    let [row, col] = this.convertIndexToBoardLocation(cellIndex);
    return this.boardArray[row][col] == "";
  }

  checkIfBoardIsFull() {
    return this.boardArray.every((board) => board.every((cell) => cell != ""));
  }
}

export default Board;
