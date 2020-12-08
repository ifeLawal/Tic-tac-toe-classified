// import name from './modules/'
import '../styles/styles.css';

let circle = true;

import Routing from './modules/Routing';
import GameState from './modules/GameState';

let Route = new Routing();

if(Route.currentLocation() == "/") {
    console.log("Are we here?");
    new GameState();
} else {
    console.log("Or are we here?");
    document.querySelector(".game-space").innerHTML = `<h1>Error page</h1>`;
}


if(module.hot) {
    module.hot.accept();
}
