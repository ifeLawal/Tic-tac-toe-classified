const path = require("path");
const express = require("express");
const socketIO = require('socket.io');

const utils = require('./utils.js');
const GameStateServer = require('./GameStateServer.js');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');

const app = express();
const PORT = process.env.PORT || 3000;

const INDEX = '/index.html';
const FRONTEND_DIR = './app';

const currentTask = process.env.npm_lifecycle_event;

// const devServerEnabled = true;

if(currentTask == 'start') {
    //reload=true:Enable auto reloading when changing JS files or content
    //timeout=1000:Time from disconnecting from server to reconnecting
    config.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');

    //Add HMR plugin
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);

    //Enable "webpack-dev-middleware"
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }))

    //Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(FRONTEND_DIR));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../app', INDEX));
})

const server = app.listen(PORT, () => {
    console.log('Server started on port:' + PORT);
});

const io = socketIO(server);
let sockets = [];
let rooms = [{player1: null, player2: null}];

io.on('connection', (socket) => {
    // console.log('Client connected', socket.id);
    // sockets.push(socket.id);
    // console.log('updated after connection: ', sockets);

    // socket.on("yes", function() {
    //     console.log("yes");
    // })

    socket.on('playerJoined', function() {
        if(rooms[0].player1 == null) {
            rooms[0].player1 = socket;
            console.log("Player1 filled", socket.id);
        } else if (rooms[0].player2 == null) {
            rooms[0].player2 = socket;
            console.log("Player2 filled", socket.id);
        }
        if(rooms[0].player1 && rooms[0].player2) {
            io.sockets.emit("roomReady", {mark: 'x', socketId: rooms[0].player1.id});
            new GameStateServer(rooms[0]);
            console.log("Room ready emitted");
            rooms[0] = [];
        }
    })

    // Handle tic tac toe cell click
    // socket.on('boardClicked', function(data) {
    //     console.log(data);
    //     io.sockets.emit('boardClicked', data);
    // })

    // broadcast tic tac toe hover
    socket.on('hover', function(data) {
        // console.log(data);
        socket.broadcast.emit('hover', data);
    })

    socket.on('disconnect', function() {
        console.log("Client has disconnected: " + socket.id);
        if(rooms[0].player1 && rooms[0].player1.id == socket.id) {
            rooms[0].player1 = null;
        } else if (rooms[0].player2 && rooms[0].player2.id == socket.id) {
            rooms[0].player2 = null;
        }
        // console.log('updated after disconnection: ', sockets);
    });
})