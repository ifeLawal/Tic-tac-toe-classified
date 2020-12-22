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
    this.matches = {
      x: [],
      o: [],
    };

    this.boardOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  setupGame(boardOrder) {
    this.createBoards();
    this.megaBoardArray = this.createTwoDBoard();
    if(boardOrder) {
      this.boardOrder = boardOrder;
    } else {
      this.boardOrder = utils.shuffle(this.boardOrder);
    }
    console.log({boardOrder}, {boardOrder: this.boardOrder}, {boardIndex: this.boardIndex});
    this.currentBoard = this.boardOrder[this.boardIndex];
    console.log({currentBoard: this.currentBoard}, {boards: this.boards});
    this.boards[this.currentBoard].lookActive();
    this.activate();
  }

  lookActive() {
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

  activate() {
    this.boards[this.currentBoard].activate();

    this.boards.forEach((board, index) => {
      board.on("validMove", ($event) => {
        if (this.checkIfMoveIsValid(index)) {
          this.emit("validMove", { cellIndex: $event.cellIndex });
        } else {
          // invalid move
        }
      });

      board.on("hover", ($event) => {
        if (this.checkIfMoveIsValid(index)) {
          this.emit("hover", {cellIndex: $event.cellIndex});
        }
      });

      board.on("removeHover", ($event) => {
        this.emit("removeHover", { cellIndex: $event.cellIndex });
      });
    });

    this.on("makeMove", ($event) => {
      this.makeMove($event.cellIndex, $event.mark);

      if (this.checkForWin() == true) {
        this.emit("gameWon", { mark: $event.mark });
      } else if (this.checkIfBoardIsFull()) {
        this.emit("boardIsFull", { mark: "" });
      } else {
        this.emit("changeTurn");
      }
    });

    this.on("validHover", ($event) => {
      this.boards[this.currentBoard].setBoardHover($event.mark);
      if($event.cellIndex) {
        this.boards[this.currentBoard].cells[$event.cellIndex].hoverCell();
      }
    });

    this.on("validRemoveHover", ($event) => {
      this.boards[this.currentBoard].cells[$event.cellIndex].removeHoverCell();
    })
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
    let win =
      this.checkDiagonalMatches() ||
      this.checkHorizontalMatches() ||
      this.checkVerticalMatches();

    this.colorMatch();
    return win;
  }

  checkDiagonalMatches() {
    let xMatchesInARow = 0;
    let oMatchesInARow = 0;
    let matches = {
      o: [],
      x: [],
    };

    // sample 2 dimensional indices this covers
    // 2,0; 1,1; 0,2
    // 3,0; 2,1; 1,2; 0,3
    // to automate this you subtract along the x-axis in the outer loop and start y
    // at 0, incrementing it until it reaches the x value while subtracting it's
    // value from x to get the appropriate x value
    // however since you are evaluating against the next value, +1 position, in the inner loop
    // you stop once y equals the initial x aka if x starts at 2 when y
    // becomes 2

    let matchesInARow = 1; // since the item matches with itself, we start with 1
    let matchesXAndYPos;

    for (
      let x = LENGTH_OF_TIC_TAC_TOE_BOARD - 1;
      x < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD;
      x++
    ) {
      for (let y = 0; y < x; y++) {
        // if this is the first check, set the starting match as itself
        if (matchesInARow == 1) {
          matchesXAndYPos = [{ xPos: x - y, yPos: y }];
        }
        if (
          this.megaBoardArray[x - y][y] ==
            this.megaBoardArray[x - y - 1][y + 1] &&
          this.megaBoardArray[x - y][y] != ""
        ) {
          matchesInARow++;
          matchesXAndYPos.push({ xPos: x - y - 1, yPos: y + 1 });
        } else if (matchesInARow >= 3) {
          // if you reach the end and have 3 or more matches
          // or you found 3 or more matches in the middle
          // give credit for those matches to a player
          if (this.megaBoardArray[x - y][y] == "x") {
            xMatchesInARow += Math.floor(matchesInARow / 3);
            matches["x"].push(matchesXAndYPos);
          } else {
            oMatchesInARow += Math.floor(matchesInARow / 3);
            matches["o"].push(matchesXAndYPos);
          }

          // dividing the matchesInARow by 3 and adding the floored/int
          // value gives us 1 point for everything in the 3-5 range and 2
          // points for matches in the 6-8 range and 3 points for 9
          // matches
          matchesInARow = 1;
        } else {
          matchesInARow = 1;
        }
        // if we have reached the end of the diagonal
        // and have a match of 3 or more
        // give credit to whoever has the matches and reset the count
        if (y + 1 >= x && matchesInARow >= 3) {
          if (this.megaBoardArray[x - y][y] == "x") {
            xMatchesInARow += Math.floor(matchesInARow / 3);
            matches["x"].push(matchesXAndYPos);
          } else {
            oMatchesInARow += Math.floor(matchesInARow / 3);
            matches["o"].push(matchesXAndYPos);
          }
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
      y < LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - LENGTH_OF_TIC_TAC_TOE_BOARD;
      y++
    ) {
      for (
        let x = LENGTH_OF_MEGA_TIC_TAC_TOE_BOARD - 1, i = 0;
        x > y;
        x--, i++
      ) {
        if (matchesInARow == 1) {
          matchesXAndYPos = [{ xPos: x, yPos: y + i }];
        }
        if (
          this.megaBoardArray[x][y + i] ==
            this.megaBoardArray[x - 1][y + i + 1] &&
          this.megaBoardArray[x][y + i] != ""
        ) {
          matchesInARow++;
          matchesXAndYPos.push({ xPos: x - 1, yPos: y + i + 1 });
        } else if (matchesInARow >= 3) {
          if (this.megaBoardArray[x][y + i] == "x") {
            xMatchesInARow += Math.floor(matchesInARow / 3);
            matches["x"].push(matchesXAndYPos);
          } else {
            oMatchesInARow += Math.floor(matchesInARow / 3);
            matches["x"].push(matchesXAndYPos);
          }
          // dividing the matchesInARow by 3 and adding the floored/int
          // value gives us 1 point for everything in the 3-5 range and 2
          // points for matches in the 6-8 range and 3 points for 9
          // matches
          matchesInARow = 1;
        } else {
          matchesInARow = 1;
        }

        if (x - 1 <= y && matchesInARow >= 3) {
          if (this.megaBoardArray[x][y + i] == "x") {
            xMatchesInARow += Math.floor(matchesInARow / 3);
            matches["x"].push(matchesXAndYPos);
          } else {
            oMatchesInARow += Math.floor(matchesInARow / 3);
            matches["x"].push(matchesXAndYPos);
          }
          matchesInARow = 1;
          matchesXAndYPos = [];
        }
      }
      matchesInARow = 1; // reset matches for the new cycle
      matchesXAndYPos = [];
    }

    return false;
  }

  checkVerticalMatches() {
    let xMatchesInARow = 0;
    let oMatchesInARow = 0;

    let matches = {
      o: [],
      x: []
    }

    let matchesInARow = 1; // since the item matches with itself, we start with 1
    let matchesXAndYPos;

    // vertical win
    for (let y = 0; y < this.megaBoardArray[0].length; y++) {
        for (let x = 0; x < this.megaBoardArray.length-1; x++) {
            if(matchesInARow == 1) {
                matchesXAndYPos = [
                    {xPos:x,yPos:y}
                ];
            }
            if (this.megaBoardArray[x][y] == this.megaBoardArray[x+1][y] && this.megaBoardArray[x][y] != '') {
                matchesInARow++;
                matchesXAndYPos.push({xPos:x+1,yPos:y});
            } else if(matchesInARow >= 3) {
                // if you reach the end and have 3 or more matches
                // or you found 3 or more matches in the middle
                // give credit for those matches to a player
                if(this.megaBoardArray[x][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    matches["x"].push(matchesXAndYPos);
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    matches["x"].push(matchesXAndYPos);
                }
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(x+1 == this.megaBoardArray.length-1 && matchesInARow >= 3) {
                if(this.megaBoardArray[x][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    matches["x"].push(matchesXAndYPos);
                } 
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    matches["x"].push(matchesXAndYPos);
                }
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
                matchesXAndYPos = [];
            }
        }
        matchesInARow = 1;
        matchesXAndYPos = [];
    }
    return [xMatchesInARow, oMatchesInARow];
  }

  checkHorizontalMatches() {
    let matchesInARow = 1;
    let xMatchesInARow = 0;
    let oMatchesInARow = 0;
    
    let matches = {
      o: [],
      x: []
    }

    // horizontal win
    for(let x = 0; x < this.megaBoardArray.length; x++) {
        for (let y = 0; y < this.megaBoardArray[x].length-1; y++) {
            if(matchesInARow==1) {
                matchesXAndYPos = [
                    {xPos:x,yPos:y}
                ];
            }
            if (this.megaBoardArray[x][y] == this.megaBoardArray[x][y+1] && this.megaBoardArray[x][y] != '') {
                matchesInARow++;
                matchesXAndYPos.push({xPos:x,yPos:y+1});
            } 
            else if(matchesInARow >= 3) {
                if(this.megaBoardArray[x][y] == 'x') {
                    xMatchesInARow+= Math.floor(matchesInARow/3);
                    matches["x"].push(matchesXAndYPos);
                }
                else {
                    oMatchesInARow+= Math.floor(matchesInARow/3);
                    matches["x"].push(matchesXAndYPos);
                } 
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
            } else {
                matchesInARow = 1;
            }

            if(y+1 == this.megaBoardArray[x].length-1 && matchesInARow >=3) {
                if(this.megaBoardArray[x][y] == 'x') {
                    xMatchesInARow += Math.floor(matchesInARow/3);
                    matches["x"].push(matchesXAndYPos);
                }
                else {
                    oMatchesInARow += Math.floor(matchesInARow/3);
                    matches["x"].push(matchesXAndYPos);
                } 
                // dividing the matchesInARow by 3 and adding the floored/int
                // values gives us 1 point for everything in the 3-5 range and 2
                // points for matches in the 6-8 range and 3 points for 9
                // matches
                matchesInARow = 1;
                matchesXAndYPos = [];
            }
        }
        matchesInARow = 1;
        matchesXAndYPos = [];
    }
    return [xMatchesInARow, oMatchesInARow];
  }
}

export default MegaTicTacToeBoard;
