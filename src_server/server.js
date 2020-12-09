const path = require("path");
const express = require("express");
const socketIO = require('socket.io');

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

// app.get('/about', (req, res) => {

// })

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