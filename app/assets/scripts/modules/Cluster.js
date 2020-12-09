import Cell from "./Cell";
import EventEmitter from "events";

let socket = io();
const LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD = 9;
const LENGTH_OF_TIC_TAC_TOE_BOARD = 3;

class Cluster extends EventEmitter {
  constructor(currentPlayer) {
    super();
    this.cells = [];
    this.currentPlayer = currentPlayer;
    this.winner;
    this.boardArray = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.matches = {
      x: [],
      o: [],
    };
    this.clusterBoard = this.createBoard();
    this.setBoardPlayer(currentPlayer);
    this.setupBoardInteraction();
  }

  createBoard() {
    let div = document.createElement("div");
    div.classList.add("tictactoe-board__cluster");
    div.setAttribute("data-cluster", "");
    for (let i = 0; i < 9; i++) {
      let newCell = new Cell(this.currentPlayer);
      div.appendChild(newCell.getCell());
      this.cells.push(newCell);
    }

    return div;
  }

  setupBoardInteraction() {
    this.cells.map((cell, index) => {

      cell.on("boardClicked", () => {

        window.socket.emit("boardClicked", {
          index: index
        });

        this.fillBoard(index);
        let horizontalMatch = this.checkHorizontalMatches();
        let verticalMatch = this.checkVerticalMatches();
        let diagonalMatch = this.checkDiagonalMatches();
        // console.log(`Horizontal matches: ${horizontalMatch}}`);
        // console.log(`Vertical matches: ${verticalMatch}`);
        // console.log(`Diagonal matches: ${diagonalMatch}`);
        this.colorMatch();
        if (horizontalMatch || verticalMatch || diagonalMatch) {
          console.log(`emitting the winner ${this.winner}`);
          this.emit("gameFinished");
        } else {
          this.emit("clusterboardClicked");

          this.cells.forEach((cell) => {
            if (this.currentPlayer == "x") {
              cell.setMarker("x");
            } else {
              cell.setMarker("o");
            }
          });
        }
      });
    });

    // socket catch socket.on()
    window.socket.on('boardClicked', (data) => {
      console.log(this.cells[data.index].fillCell());
    });
  }

  setBoardPlayer(player) {
    if (player == "x") {
      this.clusterBoard.classList.remove(
        "tictactoe-board__cluster--circle-is-visible"
      );
      this.clusterBoard.classList.add("tictactoe-board__cluster--x-is-visible");
    } else {
      this.clusterBoard.classList.add(
        "tictactoe-board__cluster--circle-is-visible"
      );
      this.clusterBoard.classList.remove(
        "tictactoe-board__cluster--x-is-visible"
      );
    }
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  getClusterBoard() {
    return this.clusterBoard;
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
            this.cells[cellIndex]
              .getCell()
              .classList.add("tictactoe-board__cell--red");
          } else {
            let cellIndex = matchesArr[i][j];
            // console.log({ cellIndex }, `cell ${this.cells[cellIndex]}`);
            this.cells[cellIndex]
              .getCell()
              .classList.add("tictactoe-board__cell--blue");
          }
        }
      }
    }
    /* for(let i = 0; i < this.matches.length; i++) {
            let marker = ;
            for(let j = 0; j < this.matches[i].length; j++) {
                if(marker == 'x') {
                    let cellIndex = matches[i][j];
                    console.log({cellIndex}, `cell ${this.cells[cellIndex]}`);
                    this.cells[cellIndex].getCell().classList.add("tictactoe-board__cell--red");
                } else {
                    let cellIndex = matches[i][j];
                    console.log({cellIndex}, `cell ${this.cells[cellIndex]}`);
                    this.cells[cellIndex].getCell().classList.add("tictactoe-board__cell--blue");
                }
            }
        }*/
  }

  // check for matches
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
    // console.log(
    //   `length forward slash matches ${forwardSlashMatchIndices.length}`
    // );
    // console.log(`length back slash matches ${backSlashMatchIndices.length}`);

    if (forwardSlashMatchIndices.length == 3) {
      // it might make more sense to have a set winner function
      this.winner = diagonalForwardSlashMark;
      this.matches[diagonalForwardSlashMark].push(forwardSlashMatchIndices);
    }
    if (backSlashMatchIndices.length == 3) {
      // it might make more sense to have a set winner function
      this.winner = diagonalBackSlashMark;
      this.matches[diagonalBackSlashMark].push(backSlashMatchIndices);
    }

    return foundBackSlashMatch || foundForwardSlashMatch;
  }

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
        // it might make more sense to have a set winner function
        this.winner = firstMark;
        this.matches[firstMark].push(matchIndices);
        return foundMatch;
      }
    }

    return foundMatch;
  }

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
        // it might make more sense to have a set winner function
        this.winner = firstMark;
        this.matches[firstMark].push(matchIndices);
        return foundMatch;
      }
    }

    return foundMatch;
  }

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

  fillBoard(cellIndex) {
    let [boardRow, boardCol] = this.convertIndexToBoardLocation(cellIndex);
    this.boardArray[boardRow][boardCol] = this.currentPlayer;
    // console.log(this.boardArray);
  }

  getWinner() {
    return this.winner;
  }
}

export default Cluster;
