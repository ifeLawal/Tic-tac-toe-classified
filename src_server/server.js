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

// const currentTask = process.env.npm_lifecycle_event;

const devServerEnabled = true;

if(devServerEnabled) {
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
    res.sendFile(path.join(__dirname, INDEX));
})

const server = app.listen(PORT, () => {
    console.log('Server started on port:' + PORT);
});

const io = socketIO(server);