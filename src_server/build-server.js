const path = require("path");
const express = require("express");
const socketIO = require('socket.io');

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

io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    // Handle tic tac toe cell click
    socket.on('boardClicked', function(data) {
        console.log(data);
        io.sockets.emit('boardClicked', data);
    })

    // broadcast tic tac toe hover
    socket.on('hover', function(data) {
        // console.log(data);
        socket.broadcast.emit('hover', data);
    })

    socket.on('disconnect', function() {
        console.log("Client has disconnected: " + socket.id);
        // removePlayer(socket);
    });
})