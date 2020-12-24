const path = require("path");
const express = require("express");
const socketIO = require('socket.io');

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
let roomNames = ["Room1", "Room2", "Room3", "Room4", "Room5", "Room6", "Room7", "Room8", "Room9", "Room10"];
let index = 0;

io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    socket.on('playerJoined', function() {
        if(rooms[0].player1 == null) {
            rooms[0].player1 = socket;
            socket.join(roomNames[index]);
            console.log("Player1 filled", socket.id);
        } else if (rooms[0].player2 == null) {
            rooms[0].player2 = socket;
            socket.join(roomNames[index]);
            console.log("Player2 filled", socket.id);
        }
        if(rooms[0].player1 && rooms[0].player2) {
            io.sockets.emit("roomReady", [{name: 'player1', mark: 'x', socketId: rooms[0].player1.id},{name: 'player2', mark: 'o', socketId: rooms[0].player2.id}]);
            new GameStateServer(rooms[0], roomNames[index]);
            console.log("Room ready emitted");
            rooms[0] = [];
            index = index + 1 % roomNames.length;
        }
    })

    socket.on('disconnect', function() {
        console.log("Client has disconnected: " + socket.id);
        if(rooms[0].player1 && rooms[0].player1.id == socket.id) {
            rooms[0].player1.leave(roomNames[index]);
            rooms[0].player1 = null;
        } else if (rooms[0].player2 && rooms[0].player2.id == socket.id) {
            rooms[0].player2.leave(roomNames[index]);
            rooms[0].player2 = null;
        }
    });
})