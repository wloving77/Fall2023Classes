const http = require('http');

const server = http.createServer();
let i = 20;

server.on('request', (request, response) => {
    i--;
    console.log("Test: " + i);
    response.writeHead(200, {
        'Content-type': 'text/JSON'
    });
    response.end(JSON.stringify({ "counter": i }));
    if (i < 0) { process.exit(); }
});
server.on('error', error => console.error(error.stack));
server.listen(3009, "0.0.0.0", () => console.log('server started on port 3009'));