import Board from "./Board";
import utils from "./utils";
import EventEmitter from "events";

const LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD = 9;
const LENGTH_OF_TIC_TAC_TOE_BOARD = 3;

class MegaTicTacToeBoard extends EventEmitter {
  constructor() {
    super();
    this.scoreArea = document.querySelector("#mega-tictactoe-score");
    this.xMatches = document.querySelector("#x-matches");
    this.oMatches = document.querySelector("#o-matches");

    this.board = document.querySelector(".tictactoe-board");
    this.boards = [];

    this.megaBoardArray;
    this.boardOrder = this.createBoardOrder();
    this.boardIndex = 0;
    this.currentBoard;
    this.matches = {
      x: [],
      o: [],
    };

    this.boardOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  score(xMatches, oMatches) {
    this.xMatches.innerHTML = `x matches: ${xMatches}`;
    this.oMatches.innerHTML = `o matches: ${oMatches}`;
  }

  setupGame(boardOrder) {
    this.scoreArea.classList.add("tictactoe-board__score-area--is-visible");
    this.createBoards();
    this.megaBoardArray = this.createTwoDBoard();
    if (boardOrder) {
      this.boardOrder = boardOrder;
    } else {
      this.boardOrder = utils.shuffle(this.boardOrder);
    }
    // console.log(
    //   { boardOrder },
    //   { boardOrder: this.boardOrder },
    //   { boardIndex: this.boardIndex }
    // );
    this.currentBoard = this.boardOrder[this.boardIndex];
    // console.log({ currentBoard: this.currentBoard }, { boards: this.boards });
    this.boards[this.currentBoard].lookActive();
    this.activate();
  }

  createTwoDBoard() {
    let outerArr = [];
    for (let i = 0; i < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD; i++) {
      outerArr.push(new Array(LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD));
      outerArr[i].fill("");
    }
    return outerArr;
  }

  createBoards() {
    for (let i = 0; i < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD; i++) {
      let board = new Board();
      this.boards.push(board);
    }
  }

  createBoardOrder() {
    let board_order = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    return utils.shuffle(board_order);
  }

  fillBoard(boardIndex, cellIndex, mark) {
    let boardPosition = this.convertIndextoBoardLocation(boardIndex);
    let cellPosition = this.convertIndextoBoardLocation(cellIndex);

    boardPosition = boardPosition.map((x) => x * LENGTH_OF_TIC_TAC_TOE_BOARD);

    let [row, col] = boardPosition.map((num, index) => {
      return num + cellPosition[index];
    });

    console.log(
      { boardIndex },
      { cellIndex },
      { row },
      { col },
      { boardPosition },
      { cellPosition }
    );
    this.megaBoardArray[row][col] = mark;
  }

  convertIndextoBoardLocation(val) {
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
  convertBoardToClusterandIndex(xPos, yPos) {
    let boardIndex = 0;
    let cellIndex = 0;

    boardIndex =
      Math.floor(xPos / LENGTH_OF_TIC_TAC_TOE_BOARD) *
        LENGTH_OF_TIC_TAC_TOE_BOARD +
      Math.floor(yPos / LENGTH_OF_TIC_TAC_TOE_BOARD);
    cellIndex =
      (xPos % LENGTH_OF_TIC_TAC_TOE_BOARD) * 3 +
      (yPos % LENGTH_OF_TIC_TAC_TOE_BOARD);

    return [boardIndex, cellIndex];
  }

  activate() {
    this.boards[this.currentBoard].activate();

    this.boards.forEach((board, index) => {
      board.on("validMove", ($event) => {
        if (this.checkIfMoveIsValid(index)) {
          this.emit("validMove", {
            boardIndex: this.currentBoard,
            cellIndex: $event.cellIndex,
          });
        } else {
          // invalid move
        }
      });

      board.on("hover", ($event) => {
        if (this.checkIfMoveIsValid(index)) {
          this.emit("hover", { cellIndex: $event.cellIndex });
        }
      });

      board.on("removeHover", ($event) => {
        this.emit("removeHover", { cellIndex: $event.cellIndex });
      });
    });

    this.on("makeMove", ($event) => {
      this.makeMove($event.cellIndex, $event.mark);
      this.fillBoard($event.boardIndex, $event.cellIndex, $event.mark);

      if (this.checkForWin() == true) {
        this.emit("gameWon", { mark: $event.mark });
      } else {
        this.emit("changeTurn");
      }
    });

    this.on("validHover", ($event) => {
      this.boards[this.currentBoard].setBoardHover($event.mark);
      if ($event.cellIndex) {
        this.boards[this.currentBoard].cells[$event.cellIndex].hoverCell();
      }
    });

    this.on("validRemoveHover", ($event) => {
      this.boards[this.currentBoard].cells[$event.cellIndex].removeHoverCell();
    });
  }

  setBoardHover(mark) {
    this.boards[this.currentBoard].setBoardHover(mark);
  }

  checkIfMoveIsValid(index) {
    return index == this.currentBoard;
  }

  makeMove(cellIndex, mark) {
    this.boards[this.currentBoard].makeMove(cellIndex, mark);
  }

  runGame() {
    this.boards[this.boardIndex].runGame();
    this.boards.forEach((board) => {
      board.on("click", () => {});
    });
  }

  // Front end actions
  destroyBoard() {
    while (this.board.firstChild) {
      this.board.removeChild(this.board.lastChild);
    }
  }

  colorMatch() {
    let matches = this.matches;
    // console.log({ matches });
    this.repaint();
    for (let marker in matches) {
      //   console.log(marker);
      let matchesArr = matches[marker];
      for (let i = 0; i < matchesArr.length; i++) {
        for (let j = 0; j < matchesArr[i].length; j++) {
          let boardIndex = matchesArr[i][j].boardIndex;
          let cellIndex = matchesArr[i][j].cellIndex;
          console.log(matchesArr[i][j]);
          if (marker == "x") {
            this.boards[boardIndex].cells[cellIndex].colorCell("red");
          } else {
            // console.log({ cellIndex }, `cell ${this.cells[cellIndex]}`);
            this.boards[boardIndex].cells[cellIndex].colorCell("blue");
          }
        }
      }
    }
  }

  checkIfBoardIsFull() {
    if (this.boards[this.currentBoard].checkIfBoardIsFull()) {
      this.boardIndex++;
      if (this.boardIndex >= this.boards.length) {
        return true;
      }
      this.currentBoard = this.boardOrder[this.boardIndex];
      this.boards[this.currentBoard].activate();
      this.boards[this.currentBoard].lookActive();
    }
    return false;
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

  checkForWin() {
    let diagonalMatches = this.checkDiagonalMatches();
    let horizontalMatches = this.checkHorizontalMatches();
    let verticalMatches = this.checkVerticalMatches();

    console.log(
      { diagonalMatches },
      { horizontalMatches },
      { verticalMatches }
    );

    this.matches["x"] = []
      .concat(diagonalMatches["x"])
      .concat(horizontalMatches["x"])
      .concat(verticalMatches["x"]);
    this.matches["o"] = []
      .concat(diagonalMatches["o"])
      .concat(horizontalMatches["o"])
      .concat(verticalMatches["o"]);

    this.score(this.matches["x"].length, this.matches["o"].length);

    this.colorMatch();

    if (this.checkIfBoardIsFull()) {
      return true;
    }
    return false;
  }

  checkDiagonalMatches() {
    let matches = {
      o: [],
      x: [],
    };

    /* 
      positive slope 
    */
    // sample 2 dimensional indices this covers
    // 2,0; 1,1; 0,2
    // 3,0; 2,1; 1,2; 0,3
    // 8,0; 7,1; ... 1,7; 0,8;
    // to automate this you subtract along the x-axis in the outer loop and start y
    // at 0, incrementing it until it reaches the x value while subtracting it's
    // value from x to get the appropriate x value
    // however since you are evaluating against the next value, +1 position, in the inner loop
    // you stop once y equals the initial x aka if x starts at 2 when y
    // becomes 2

    let matchesInARow = 1; // since the item matches with itself, we start with 1
    let matchesXAndYPos;
    let boardIndex, cellIndex;

    for (
      let x = LENGTH_OF_TIC_TAC_TOE_BOARD - 1;
      x < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD;
      x++
    ) {
      for (let y = 0; y < x; y++) {
        // if this is the first check, set the starting match as itself
        if (matchesInARow == 1) {
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x - y,
            y
          );
          matchesXAndYPos = [{ boardIndex, cellIndex }];
        }
        if (
          this.megaBoardArray[x - y][y] ==
            this.megaBoardArray[x - y - 1][y + 1] &&
          this.megaBoardArray[x - y][y] != ""
        ) {
          matchesInARow++;
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x - y - 1,
            y + 1
          );
          matchesXAndYPos.push({ boardIndex, cellIndex });
        } else {
          matchesInARow = 1;
        }
        if (matchesInARow == 3) {
          // if you reach the end and have 3 or more matches
          // or you found 3 or more matches in the middle
          // give credit for those matches to a player
          if (this.megaBoardArray[x - y][y] == "x") {
            matches["x"].push([].concat(matchesXAndYPos));
          } else {
            matches["o"].push([].concat(matchesXAndYPos));
          }

          // dividing the matchesInARow by 3 and adding the floored/int
          // value gives us 1 point for everything in the 3-5 range and 2
          // points for matches in the 6-8 range and 3 points for 9
          // matches
          x++;
          matchesInARow = 1;
          matchesXAndYPos = [];
        }
      }
      matchesInARow = 1; // reset matches for he new cycle
      matchesXAndYPos = [];
    }

    // sample 2 dimensional indices this covers
    // 8,1; 7,2; 6,3 ... 2,7; 1,8
    // 8,2; 7,3 ... 3,7; 2,8
    // 6,8; 7,7; 8,6;
    // to automate this you subtract along the x-axis in the outer loop and start y
    // at 1, incrementing it until it reaches the x value while subtracting it's
    // value from x to get the appropriate x value
    // however since you are evaluating against the next value, +1 position, in the inner loop
    // you stop once y equals the initial x aka if x starts at 8 when y
    // becomes 8
    // since x is always 8, I decided to move down the y to tell if all the
    // diagonals are checked
    // in the inner loop, the end of how low the x should go along the diagonal
    // coincides with shrinking in the range using the increasing y value

    for (
      let y = 1;
      y <= LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - LENGTH_OF_TIC_TAC_TOE_BOARD;
      y++
    ) {
      for (
        let x = LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - 1, i = 0;
        x > y;
        x--, i++
      ) {
        if (matchesInARow == 1) {
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x,
            y + i
          );
          matchesXAndYPos = [{ boardIndex, cellIndex }];
        }
        if (
          this.megaBoardArray[x][y + i] ==
            this.megaBoardArray[x - 1][y + i + 1] &&
          this.megaBoardArray[x][y + i] != ""
        ) {
          matchesInARow++;
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x - 1,
            y + i + 1
          );
          matchesXAndYPos.push({ boardIndex, cellIndex });
        } else {
          matchesInARow = 1;
        }
        if (matchesInARow == 3) {
          if (this.megaBoardArray[x][y + i] == "x") {
            matches["x"].push([].concat(matchesXAndYPos));
          } else {
            matches["o"].push([].concat(matchesXAndYPos));
          }
          // dividing the matchesInARow by 3 and adding the floored/int
          // value gives us 1 point for everything in the 3-5 range and 2
          // points for matches in the 6-8 range and 3 points for 9
          // matches
          x--, i++;
          matchesInARow = 1;
          matchesXAndYPos = [];
        }
      }
      matchesInARow = 1; // reset matches for the new cycle
      matchesXAndYPos = [];
    }

    /* 
      negative slope 
    */

    // 2 dimensional indices this covers
    // 0,6; 1,7; 2,8
    // 0,5; 1,6; 2,7; 3,8;
    // 0,0; 1,1; 2,2; ... 7,7; 8,8;
    // logic behind these 2 for loops to evaluate matches in those indices:
    // outer loop starts at y of 6 decreases towards 0
    // inner loop always starts x at 0 and ends at the edge and keeps pushing
    // down 1 as it's limit, y, reduces by 1

    for (
      let y = LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - LENGTH_OF_TIC_TAC_TOE_BOARD;
      y >= 0;
      y--
    ) {
      // x = 2
      for (let x = 0; x < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - y - 1; x++) {
        if (matchesInARow == 1) {
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x,
            y + x
          );
          matchesXAndYPos = [{ boardIndex, cellIndex }];
        }
        if (
          this.megaBoardArray[x][y + x] ==
            this.megaBoardArray[x + 1][y + x + 1] &&
          this.megaBoardArray[x][y + x] != ""
        ) {
          matchesInARow++;
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x + 1,
            y + x + 1
          );
          matchesXAndYPos.push({ boardIndex, cellIndex });
        } else {
          matchesInARow = 1;
        }
        if (matchesInARow == 3) {
          if (this.megaBoardArray[x][y + x] == "x") {
            matches["x"].push([].concat(matchesXAndYPos));
          } else {
            matches["o"].push([].concat(matchesXAndYPos));
          }

          x++;
          matchesInARow = 1;
          matchesXAndYPos = [];
        }
      }
      matchesInARow = 1;
      matchesXAndYPos = [];
    }

    // sample 2 dimensional indices this covers
    // 1,0; 2,1; 3,2 ... 6,5; 7,6; 8,7
    // 2,0; 3,1; ... 7,5; 8,6
    // 6,0; 7,1; 8,2; || 5,0; 6,1; 7,2; 8,3;
    // what's the logic behind these 2 for loops to evaluate matches in those indices?:
    // the outer loop starts at x of 1 and increases towards 6
    // the inner loop always starts at 0 and ends at the edge and keeps pushing
    // 1 more in as the x increases, as we go down, by a factor of 1
    // since we evaluate against the next cell
    // we want the limit to go to the value before the next cell therefore y + 1
    for (
      let x = 1;
      x <= LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - LENGTH_OF_TIC_TAC_TOE_BOARD;
      x++
    ) {
      for (let y = 0; y < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - x - 1; y++) {
        if (matchesInARow == 1) {
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x + y,
            y
          );
          matchesXAndYPos = [{ boardIndex, cellIndex }];
        }
        if (
          this.megaBoardArray[x + y][y] ==
            this.megaBoardArray[x + y + 1][y + 1] &&
          this.megaBoardArray[x + y][y] != ""
        ) {
          matchesInARow++;
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x + y + 1,
            y + 1
          );
          matchesXAndYPos.push({ boardIndex, cellIndex });
        } else {
          matchesInARow = 1;
        }
        if (matchesInARow == 3) {
          if (this.megaBoardArray[x + y][y] == "x") {
            matches["x"].push([].concat(matchesXAndYPos));
          } else {
            matches["o"].push([].concat(matchesXAndYPos));
          }

          y++;
          matchesInARow = 1;
          matchesXAndYPos = [];
        }
      }
      matchesInARow = 1;
      matchesXAndYPos = [];
    }

    return matches;
  }

  checkVerticalMatches() {
    let matches = {
      o: [],
      x: [],
    };

    let matchesInARow = 1; // since the item matches with itself, we start with 1
    let matchesXAndYPos;
    let boardIndex, cellIndex;

    // vertical win
    for (let y = 0; y < this.megaBoardArray[0].length; y++) {
      for (let x = 0; x < this.megaBoardArray.length - 1; x++) {
        if (matchesInARow == 1) {
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(x, y);
          matchesXAndYPos = [{ boardIndex, cellIndex }];
        }
        if (
          this.megaBoardArray[x][y] == this.megaBoardArray[x + 1][y] &&
          this.megaBoardArray[x][y] != ""
        ) {
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x + 1,
            y
          );
          matchesInARow++;
          matchesXAndYPos.push({ boardIndex, cellIndex });
        } else {
          matchesInARow = 1;
        }

        if (matchesInARow == 3) {
          if (this.megaBoardArray[x][y] == "x") {
            console.log("We made it", { matchesXAndYPos });
            matches["x"].push([].concat(matchesXAndYPos));
          } else {
            matches["o"].push([].concat(matchesXAndYPos));
          }

          x++;
          matchesInARow = 1;
          matchesXAndYPos = [];
        }
      }
      matchesInARow = 1;
      matchesXAndYPos = [];
    }
    return matches;
  }

  checkHorizontalMatches() {
    let matches = {
      o: [],
      x: [],
    };

    let matchesInARow = 1; // since the item matches with itself, we start with 1
    let matchesXAndYPos;
    let boardIndex, cellIndex;

    // horizontal win
    for (let x = 0; x < this.megaBoardArray.length; x++) {
      for (let y = 0; y < this.megaBoardArray[x].length - 1; y++) {
        // first match is valid
        if (matchesInARow == 1) {
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(x, y);
          matchesXAndYPos = [{ boardIndex, cellIndex }];
        }
        // if the next mark matches our current mark, but is colored don't reset or add
        if (
          this.megaBoardArray[x][y] == this.megaBoardArray[x][y + 1] &&
          this.megaBoardArray[x][y] != ""
        ) {
          [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(
            x,
            y + 1
          );
          matchesInARow++;
          matchesXAndYPos.push({ boardIndex, cellIndex });
        } else {
          matchesInARow = 1;
        }
        if (matchesInARow == 3) {
          if (this.megaBoardArray[x][y] == "x") {
            matches["x"].push([].concat(matchesXAndYPos));
          } else {
            matches["o"].push([].concat(matchesXAndYPos));
          }
          // dividing the matchesInARow by 3 and adding the floored/int
          // values gives us 1 point for everything in the 3-5 range and 2
          // points for matches in the 6-8 range and 3 points for 9
          // matches
          y++;
          matchesInARow = 1;
          matchesXAndYPos = [];
        }
      }
      matchesInARow = 1;
      matchesXAndYPos = [];
    }
    return matches;
  }

  repaint() {
    //
    for (let x = 0; x < this.megaBoardArray.length; x++) {
      for (let y = 0; y < this.megaBoardArray[x].length - 1; y++) {
        let [boardIndex, cellIndex] = this.convertBoardToClusterandIndex(x, y);
        this.boards[boardIndex].cells[cellIndex].colorCell("white");
      }
    }
  }
}

export default MegaTicTacToeBoard;
