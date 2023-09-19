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
                this.checkBoard(colIndex, i);
                this.switchPlayer();
            } else if (i == 0) {
                console.log("Column is Full, Please Choose Different Column");
            }
        }

    }

    //checks if there is a winning state on the board. The player argument is so it knows who made the previous move and thus who won.
    checkBoard(colIndex, rowIndex) {

        // need to check up, down, left, right, up-left, up-right, down-left, down-right

        this.gameOver = true;

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