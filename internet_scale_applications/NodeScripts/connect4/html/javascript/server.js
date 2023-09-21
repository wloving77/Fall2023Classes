const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer();


server.on("request", (request, response) => {
    if (request.url == "/") {
        fs.readFile("html/connect4.html", (err, data) => {
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
        response.end("File not found");
    }

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

