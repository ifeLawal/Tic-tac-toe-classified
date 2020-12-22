const path = require("path");
const express = require("express");
const socketIO = require('socket.io');

const utils = require('./utils.js');
const GameStateServer = require('./GameStateServer.js');

const app = express();
const PORT = process.env.PORT || 3000;

const INDEX = 'index.html';
const FRONTEND_DIR = '../public';

app.use(express.static(path.join(__dirname, FRONTEND_DIR)));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, FRONTEND_DIR, INDEX));
})

const server = app.listen(PORT, () => {
    console.log('Server started on port:' + PORT);
});

const io = socketIO(server);
// let sockets = [];
let rooms = [{player1: null, player2: null}];
let roomName = "testRoom";

io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    // Handle tic tac toe cell click
    socket.on('boardClicked', function(data) {
        console.log(data);
        io.sockets.emit('boardClicked', data);
    })

    socket.on('playerJoined', function() {
        if(rooms[0].player1 == null) {
            rooms[0].player1 = socket;
            socket.join(roomName);
            console.log("Player1 filled", socket.id);
        } else if (rooms[0].player2 == null) {
            rooms[0].player2 = socket;
            socket.join(roomName);
            console.log("Player2 filled", socket.id);
        }
        if(rooms[0].player1 && rooms[0].player2) {
            io.sockets.emit("roomReady", [{name: 'player1', mark: 'x', socketId: rooms[0].player1.id},{name: 'player2', mark: 'o', socketId: rooms[0].player2.id}]);
            new GameStateServer(rooms[0], roomName);
            console.log("Room ready emitted");
            rooms[0] = [];
        }
    })

    // broadcast tic tac toe hover
    socket.on('hover', function(data) {
        // console.log(data);
        socket.broadcast.emit('hover', data);
    })

    socket.on('disconnect', function() {
        console.log("Client has disconnected: " + socket.id);
        if(rooms[0].player1 && rooms[0].player1.id == socket.id) {
            rooms[0].player1 = null;
            rooms[0].player1.leave(roomName);
        } else if (rooms[0].player2 && rooms[0].player2.id == socket.id) {
            rooms[0].player2 = null;
            rooms[0].player2.leave(roomName);
        }
    });
})