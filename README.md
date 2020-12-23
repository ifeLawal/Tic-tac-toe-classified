## A two player tic tac toe game

This uses express, websockets, webpack, and a few other tools to build a two player tic tac toe game.
# Game Types
* Single Player Against Non Player Character (Incomplete)
* Local Multiplayer (Tic Tac Toe and Mega Tic Tac Toe)
* Online Multiplayer (Tic Tac Toe and Mega Tic Tac Toe)
## Rules for Tic Tac Toe
* It is a two player game. Each player is a mark, X or O, and the aim is to get three in a row (horizontally, vertically, or diagonally) with your marks
* Each player goes one turn at a time
## Rules for Mega Tic Tac Toe

* You have a total of 9 regular tic tac toe boards that you will play against npc or a person next to you on
* Once a board is finished, you move to a new board randomly
* You gain 1 match for any pairings of your 3 markers (O or X) ie 3 in a row = 1 match any extra pairs (4 or 5) do not grant an additional match, 6 in a row = 2 matches any extra pairs (7 or 8) do not grant an additional match
* Whoever gets the most matches wins
## megaTicTicTacToe.js
conversion functions transforming from JS 2D array to the 1D array representation of the UI cells and boards

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing how the boards are clustered](https://raw.githubusercontent.com/ifeLawal/Tic-tac-toe-classified/main/readme-images/Tic_Tac_Board_01.png)

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of each cell index](https://raw.githubusercontent.com/ifeLawal/Tic-tac-toe-classified/main/readme-images/Tic_Tac_Board_02.png) 

**diagonalMatching()**
checking for the positive slope direction of diagonal matches

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of diagonal negtive slope matching](https://raw.githubusercontent.com/ifeLawal/Tic-tac-toe-classified/main/readme-images/Tic_Tac_Board_03.png) 

checking for the negative slope direction of diagonal matches

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of diagonal negtive slope matching](https://raw.githubusercontent.com/ifeLawal/Tic-tac-toe-classified/main/readme-images/Tic_Tac_Board_04.png)

**verticalMatching()**
checking for vertical matches

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of vertical matching.](https://raw.githubusercontent.com/ifeLawal/Tic-tac-toe-classified/main/readme-images/Tic_Tac_Board_05.png) 

**horizontalMatching()**
checking for horizontal matches

![9 tic tac toe boards stack 3 from left to right and 3 top to bottom. A showing of horizontal matching.](https://raw.githubusercontent.com/ifeLawal/Tic-tac-toe-classified/main/readme-images/Tic_Tac_Board_06.png)

# To Do
* Fix memory leaks that occur if you reload the webpage and start a new game
* Add more websockets for the online tic tac toe games