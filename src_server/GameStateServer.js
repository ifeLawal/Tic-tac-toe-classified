const utils = require('./utils.js');

class OnlineGameStateServer {
    constructor(sockets, roomName) {
        this.roomName = roomName;
        this.sockets = sockets;
        this.megaBoardOrder = utils.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);

        this.listenForGameStart(sockets);
        this.listenForTurnChange(sockets);
        this.listenForHover(sockets);
        this.listenForMegaSetup(sockets);
    }

    listenForGameStart({player1, player2}) {

        player1.on('gameInitialized', (data) => {
            player1.to(this.roomName).emit('gameInitialized', data);
        })
        player2.on('gameInitialized', (data) => {
            player2.to(this.roomName).emit('gameInitialized', data);
        })
        
        player1.on('startGame', (data) => {
            player1.to(this.roomName).emit('startGame', data);
        })
        player2.on('startGame', (data) => {
            player2.to(this.roomName).emit('startGame', data);
        })
    }
    listenForMegaSetup({player1, player2}) {

        player1.on('megaSetup', () => {
            // player1.to(this.roomName).emit('setupReady', boardOrder);
            player2.to(this.roomName).emit('setupReady', this.megaBoardOrder);
        })
        player2.on('megaSetup', (data) => {
            player1.to(this.roomName).emit('setupReady', this.megaBoardOrder);
            // player2.to(this.roomName).emit('setupReady', boardOrder);
        })
    }

    listenForHover({player1, player2}) {
        player1.on("removeHover", (data) => {
            player2.to(this.roomName).emit('validRemoveHover', data);
            player1.to(this.roomName).emit('validRemoveHover', data);
        })
        player2.on("removeHover", (data) => {
            player2.to(this.roomName).emit('validRemoveHover', data);
            player1.to(this.roomName).emit('validRemoveHover', data);
        })

        player1.on('validHover', (data) => {
            player2.emit('hover', data);
        })
        player2.on('validHover', (data) => {
            player1.emit('hover', data);
        })
        
    }

    listenForTurnChange({player1, player2}) {

        player1.on('makeMove', (data) => {
            player1.to(this.roomName).emit('reconcileMove', data);

        })
        player2.on('makeMove', (data) => {
            player2.to(this.roomName).emit('reconcileMove', data);
        })
        player1.on('changeTurn', () => {
            player1.to(this.roomName).emit('reconcilePlayerTurn');
        })
        player2.on('changeTurn', () => {
            player2.to(this.roomName).emit('reconcilePlayerTurn');
        })
    }    
}

module.exports = OnlineGameStateServer