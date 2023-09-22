const http = require("http");
const url = require("url");
const fs = require("fs");

//grab connect4 logic from connect4.js
import * as connect4 from "./javascript/connect4.js";

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
