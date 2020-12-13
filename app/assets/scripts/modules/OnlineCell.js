import EventEmitter from 'events';

class OnlineCell extends EventEmitter {
    constructor(mark, currentPlayer) {
        super();
        this.mark = mark;
        this.currentPlayer = currentPlayer;
        this.cell = this.createCell();
        this.events();
    }

    events() {
        this.cell.addEventListener("click", () => {
            // check marker type
            // if x place x, if circle place circle
            console.log(this.mark);
            if(window.socket.id === this.currentPlayer) {
                console.log("what's happening!?");
                this.fillCell();
                this.emit('boardClicked');
            } else {
                console.log("not your turn");
            }
        })
    }

    fillCell() {
        if(this.cell.classList.contains("tictactoe-board__cell--circle") || this.cell.classList.contains("tictactoe-board__cell--x")) {
            // invalid move
            console.log("invalid move");
        } else {
            if(this.mark == 'o') {
                this.cell.classList.add("tictactoe-board__cell--circle");
            } else {
                this.cell.classList.add("tictactoe-board__cell--x");
            }
        }
    }

    createCell() {
        let div = document.createElement('div');
        div.classList.add("tictactoe-board__cell");
        div.setAttribute('data-cell', '');
        return div;
    }

    getCell() {
        return this.cell;
    }

    getMark() {
        return this.mark;
    }

    setCurrentPlayer(mark, currentPlayer) {
        this.mark = mark;
        this.currentPlayer = currentPlayer;
        console.log(this.mark)
        console.log(this.currentPlayer);
        // this.events();
    }
}

export default OnlineCell;