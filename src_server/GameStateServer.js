class GameStateServer {
    constructor(sockets) {
        this.sockets = sockets;
        console.log(sockets);
        this.listenForGameStart(sockets);
        this.listenForTurnChange(sockets);
    }

    listenForGameStart({player1, player2}) {
        player1.on('gameStarted', function() {
            player2.emit('gameStarted');
        })
        player2.on('gameStarted', function() {
            player1.emit('gameStarted');
        })
    }

    listenForTurnChange({player1, player2}) {
        player1.on('boardClicked', function(data) {
            console.log(data);
            player1.emit('moveMade', data);
            player2.emit('moveMade', data);
            player1.emit('turnChange', {mark: 'o', socketId: player2.id});
            player2.emit('turnChange', {mark: 'o', socketId: player2.id});
        })
        player2.on('boardClicked', function(data) {
            player1.emit('moveMade', data);
            player2.emit('moveMade', data);
            player1.emit('turnChange', {mark: 'x', socketId: player1.id});
            player2.emit('turnChange', {mark: 'x', socketId: player1.id});
        })
    }    
}

module.exports = GameStateServer