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