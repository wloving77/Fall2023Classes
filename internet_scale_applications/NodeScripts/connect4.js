/*
Server Logic:
*/

const http = require("http");
const url = require("url");
const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());


//initializting game logic:
var gameActive = 0;
var game;


app.post("/makeMove", (request, response) => {
    const data = request.body;

    if (data && "columnValue" in data && "currentPlayer" in data) {
        let columnValue = Number(data["columnValue"]);
        let gamePlayer = Number(data['currentPlayer']);
        if (gamePlayer == game.currentPlayer) {
            let gameContinue = game.makeMove(columnValue, game.currentPlayer);
            if (gameContinue) {
                response.status(200).send("Move Made");
            } else {
                gameActive = 0;
                response.status(200).send("Move Made, but Game Over");
            }
        } else {
            response.status(200).send("Not Currently Active Player, Move Cancelled");
        }
    } else {
        response.status(400).send("Error Parsing Post request, Move Not Made");
    }
});

app.post("/startGame", (request, response) => {
    //initialize game:
    game = new Connect4(6, 7);
    player0 = new Player(0);
    player1 = new Player(1);
    game.players.push(player0);
    game.players.push(player1);

    let gameData = game.board;
    gameActive = 1;

    let json = {};
    json['gameActive'] = gameActive;
    json['gameBoard'] = gameData;
    json['currentPlayer'] = game.currentPlayer;


    response.status(200).json(json);

});

app.get("/gameState", (request, response) => {

    if (gameActive == 1) {

        //console.log("Retrieving Active Game...");

        let json = {}
        let gameData = game.board;
        json['gameActive'] = gameActive;
        json['gameBoard'] = gameData;
        json['currentPlayer'] = game.currentPlayer;

        response.status(200).json(json);

    } else if (gameActive == 0) {

        let json = {}
        json['gameActive'] = gameActive;


        response.status(200).json(json);
    }

});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, "localhost", () => {
    console.log("Listening on localhost:" + port);
});


/*
Connect4 Logic: 
*/

class Connect4 {

    // could potentially allow for variable boa
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = this.createBoard(this.cols, this.rows);
        this.players = [];
        this.currentPlayer = 0;
        this.gameOver = false;
    };

    createBoard(cols, rows) {
        let board = [];
        for (let i = 0; i < cols; i++) {
            board.push(Array(rows).fill(-1));
        }
        return board;
    };

    makeMove(colIndex, playerNumber) {
        for (let i = this.board[colIndex].length - 1; i >= 0; i--) {
            if (this.board[colIndex][i] == -1) {
                this.board[colIndex][i] = playerNumber;
                //check if this move resulted in a winning state
                let continueBool = this.checkBoard(colIndex, i, playerNumber);
                //switch player
                this.switchPlayer();
                return !continueBool;
            }

        }
        console.log("Column is full, please try a different column");
        return false;
    }

    //checks if there is a winning state on the board.
    checkBoard(colIndex, rowIndex, playerNumber) {

        //These are the different directions we need to check to validate a new move. 
        const directions = [
            [1, 0],   // Up-Down
            [0, 1],   // Right-Left
            [1, 1],   // Diagonal (positive slope)
            [1, -1],  // Diagonal (negative slope)
        ];

        // initialize to 1 because we just made a valid move.

        for (const [dx, dy] of directions) {
            let count = 1;
            let newCol = colIndex + dy;
            let newRow = rowIndex + dx;

            while (this.isValidPosition(newCol, newRow) && this.board[newCol][newRow] == playerNumber) {
                count++;
                newRow += dx;
                newCol += dy;
            }

            newCol = colIndex - dy;
            newRow = rowIndex - dx;

            while (this.isValidPosition(newCol, newRow) && this.board[newCol][newRow] == playerNumber) {
                count++;
                newRow -= dx;
                newCol -= dy;
            }

            if (count >= 4) {
                this.gameOver = true;
                return true;
            }

        }

        return false;


    }

    isValidPosition(colIndex, rowIndex) {
        // Check if the position is within the bounds of the board
        return rowIndex >= 0 && rowIndex < this.rows && colIndex >= 0 && colIndex < this.cols;
    }

    registerPlayers(players) {
        if (players.length == 2) {
            this.players = players;
        } else {
            console.log("Incorrect Number of Players");
        }
    }

    switchPlayer() {
        this.currentPlayer = (this.currentPlayer == 0) ? 1 : 0;
    }

}


// Testing: 

// game = new Connect4(6, 7);
// console.log(game.board);

// player1 = new Player("Chad", 4);
// player2 = new Player("Charles", 2);

// players = [];
// players.push(player1);
// players.push(player2);

// game.registerPlayers(players);

// console.log(game.players);

// game.makeMove(0, game.players[0]);
// game.makeMove(1, game.players[0]);
// game.makeMove(2, game.players[0]);
// game.makeMove(3, game.players[0]);


// console.log(game.board);

// console.log(game.gameOver);
