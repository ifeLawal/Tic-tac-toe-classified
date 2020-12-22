import EventEmitter from 'events';
let socket = io();
class Cell extends EventEmitter {
    constructor() {
        super();
        this.cell = this.createCell();
        this.events();
    }

    events() {
        this.cell.addEventListener("click", (e) => {
            this.handleEvent(e);
        });
        this.cell.addEventListener("mouseenter", (e) => {
            this.handleEvent(e);
        });
        this.cell.addEventListener("mouseleave", (e) => {
            this.handleEvent(e);
        });
            
    }

    handleEvent(e) {
        e.preventDefault();
        if(this.cell.classList.contains("tictactoe-board__cell--circle") || this.cell.classList.contains("tictactoe-board__cell--x")) {
            console.log("take no action");
        } else {
            // console.log("Event happening", e.type);
            if(e.type == "click") {
                this.emit('click');
            } else if(e.type == "mouseenter") {
                this.emit('hover');
            } else {
                this.emit('removeHover');
            }
        }
    }

    fillCell(mark) {
        if(mark == 'o') {
            this.cell.classList.add("tictactoe-board__cell--circle");
        } else {
            this.cell.classList.add("tictactoe-board__cell--x");
        }
        this.cell.removeEventListener('mouseenter', this.handleEvent);
        this.cell.removeEventListener('mouseleave', this.handleEvent);
    }

    createCell() {
        let div = document.createElement('div');
        div.classList.add("tictactoe-board__cell");
        div.setAttribute('data-cell', '');
        return div;
    }

    colorCell(color) {
        if(color == "red") {
            this.cell.classList.add("tictactoe-board__cell--red");
        } else {
            this.cell.classList.add("tictactoe-board__cell--blue");
        }
    }

    hoverCell() {
        this.cell.classList.add("hover");
    }

    removeHoverCell() {
        this.cell.classList.remove("hover");
    }

    getCell() {
        return this.cell;
    }
}

export default Cell;