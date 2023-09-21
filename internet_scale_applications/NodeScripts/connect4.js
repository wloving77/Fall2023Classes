const http = require("http");
const url = require("url");

const server = http.createServer();

server.on("request", (request, response) => {
    response.writeHead(200, { "Content-type": "text/html" });
    let q = url.parse(request.url, true);
    console.log(q);
    response.end(handleUserAction(q.pathname));
})


server.on("request", (request, response) => {
    const { method, url } = request;
    console.log("Logging Method, " + method + " and Url, " + url);
})

server.on("error'", error => console.error(error.stack));

server.listen(3000, "127.0.0.1", () => console.log("Server Running at http://localhost:3000"));

function handleUserAction(urlStr) {
    //parse request from pathname

    let clientUrl = urlStr.split("/");
    let returnString = "";
    if (clientUrl[1] == "gameboard") {
        returnString = "gameboard";
    } else if (clientUrl[1] == "move") {
        returnString = "move";
    } else {
        returnString = "";
    }

    return returnString;

}

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
        this.board = this.createBoard(this.rows, this.cols);
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
                this.board[colIndex][i] == player.playerNumber;
                //check if this move resulted in a winning state
                this.checkBoard(colIndex, i, player.playerNumber);
                this.switchPlayer();
            } else if (i == 0) {
                console.log("Column is Full, Please Choose Different Column");
            }
        }

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
                this.gameOver = True;
                return true;
            }

        }

        return false;


    }

    isValidPosition(colIndex, rowIndex) {
        // Check if the position is within the bounds of the board
        return rowIndex >= 0 && rowIndex < this.rows && colIndex >= 0 && col < this.cols;
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