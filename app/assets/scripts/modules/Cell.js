import EventEmitter from 'events';
let socket = io();
class Cell extends EventEmitter {
    constructor(marker) {
        super();
        this.marker = marker;
        this.cell = this.createCell();
        this.events();
    }

    events() {
        this.cell.addEventListener("click", () => {
            // check marker type
            // if x place x, if circle place circle
            console.log(this.marker);
            this.fillCell();
            this.emit('boardClicked');
        })
    }

    fillCell() {
        if(this.cell.classList.contains("tictactoe-board__cell--circle") || this.cell.classList.contains("tictactoe-board__cell--x")) {
            // invalid move
            console.log("invalid move");
        } else {
            if(this.marker == 'o') {
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

    setMarker(marker) {
        this.marker = marker;
    }
}

export default Cell;