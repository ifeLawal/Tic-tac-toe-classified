// import name from './modules/'
import '../styles/styles.css';

window.socket = io();
// console.log(window.socket);

import Routing from './modules/Routing';
import LocalMultiplayerGameState from './modules/LocalMultiplayerGameState';
import OnlineMultiplayerGameState from './modules/OnlineMultiplayerGameState';
import Navigation from './modules/Navigation';
import LoadingScreen from './modules/LoadingScreen';

const gameMode = {
    onlineTwoPlayer: {
        name: "Online Multiplayer",
        encodedName: encodeURIComponent("Online Multiplayer")
    },
    localTwoPlayer: {
        name: "Local Multiplayer",
        encodedName: encodeURIComponent("Local Multiplayer")
    },
    singlePlayer: {
        name: "Single Player",
        encodedName: encodeURIComponent("Single Player")
    },

}

let Route = new Routing();

let headerMessage = document.createElement('h1');
let messageArea = document.querySelector("#message-area");
headerMessage.innerHTML = "Choose an opponent";

if(Route.currentLocation() == "/") {
    messageArea.insertAdjacentElement("beforeend", headerMessage);
    new Navigation(gameMode.singlePlayer.name, messageArea);
    new Navigation(gameMode.localTwoPlayer.name, messageArea);
    new Navigation(gameMode.onlineTwoPlayer.name, messageArea);
    
    
} else if(Route.currentLocation() == `/${gameMode.singlePlayer.encodedName}`) {
    headerMessage.innerHTML = `We are still putting together a smart tic tac toe bot! In the meantime feel free to play against humans.`;
    // messageArea = '';
    
    messageArea.insertAdjacentElement('beforeend', headerMessage);
    new Navigation(gameMode.localTwoPlayer.name, messageArea);
    new Navigation(gameMode.onlineTwoPlayer.name, messageArea);
} else if (Route.currentLocation() == `/${gameMode.onlineTwoPlayer.encodedName}`) {
    // window.socket.emit("yes", "woah");
    console.log(window.socket);
    let loading = new LoadingScreen();
    window.socket.emit("playerJoined");
    window.socket.on("roomReady", function(currentPlayerInfo) {
        loading.removeHTML();
        new OnlineMultiplayerGameState(currentPlayerInfo);
    })
} else if (Route.currentLocation() == `/${gameMode.localTwoPlayer.encodedName}`) {
    new LocalMultiplayerGameState().initializeGame();
} else if (Route.currentLocation() == `/404`) {
    headerMessage.innerHTML = "Welcome to failure land! 🙃";
    gameSpace.insertAdjacentElement('afterbegin', headerMessage);
    
} else {
    console.log(Route.currentLocation(), `/${gameMode.localTwoPlayer.encodedName}`, Route.currentLocation() == `/${gameMode.localTwoPlayer.encodedName}`);
    document.querySelector(".game-space").innerHTML = `<h1>Error page</h1>`;
}


if(module.hot) {
    module.hot.accept();
}
