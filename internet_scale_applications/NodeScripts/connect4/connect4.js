


/*
Server Logic:
*/

const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer();

server.on("request", (request, response) => {

    //parse url and split on /
    const parsedUrl = url.parse(request.url);
    const path = parsedUrl.pathname;
    const pathParts = path.split("/");

    // load the connect4 html if that path is specified, with error handling
    if (pathParts[1] == "connect4.html") {
        fs.readFile("connect4/html/connect4.html", (err, data) => {
            if (err) {
                response.writeHead(404, { "Content-type": "text/plain" });
                response.end("File not found");
            } else {
                response.writeHead(200, { "Content-type": "text/html" });
                response.end(data);
            }
        });
    } else {
        response.writeHead(404, { "Content-type": "text/plain" });
        response.end("Invalid Url");
    }

})

server.on("error'", error => console.error(error.stack));

server.listen(3000, "127.0.0.1", () => console.log("Server Running at http://localhost:3000"));


/*
Connect4 Logic: 
*/

class Player {
    constructor(playerName, playerNumber) {
        this.playerName = playerName;
        this.playerNumber = playerNumber;
    }
}


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

    makeMove(colIndex, player) {
        for (let i = this.board[colIndex].length - 1; i >= 0; i--) {
            if (this.board[colIndex][i] == -1) {
                this.board[colIndex][i] = player.playerNumber;
                //check if this move resulted in a winning state
                this.checkBoard(colIndex, i, player.playerNumber);
                //switch player
                this.switchPlayer();
                return true;
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
        if (this.currentPlayer == 0) {
            this.currentPlayer = 1;
        } else {
            this.currentPlayer = 0;
        }
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
// game.makeMove(1, game.players[1]);
// game.makeMove(2, game.players[0]);
// game.makeMove(3, game.players[1]);


// console.log(game.board[0][game.board[0].length - 1]);


// console.log(game.board);