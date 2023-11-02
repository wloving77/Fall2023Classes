/*
Server Logic:
*/

const http = require("http");
const url = require("url");
const { MongoClient, ObjectId } = require('mongodb');

// node server logic, note the ports and host being listened on, this is for docker compatibility
const nodeHost = "0.0.0.0";
const nodePort = 3002;
const server = http.createServer();

// mongo server logic, note the ports being run on, these are specific to docker
const mongoHost = "mongo-container";
const mongoPort = 27017;
const mongoUrl = `mongodb://${mongoHost}:${mongoPort}`;

const Mongod = new MongoClient(mongoUrl);
const db = "dailyBugle";

//initialize server, begin listening, retry 3 times if failing.
async function initialize() {
    let retries = 3;
    while (retries != 0) {
        try {
            await Mongod.connect();
            console.log("Connected to MongoDB");

            server.listen(nodePort, nodeHost, () => {
                console.log(`Server Listening on http://${nodeHost}:${nodePort}`);
            });
            return;
        } catch (err) {
            retries--;
            if (retries == 0) {
                process.exit(1);
            }
            console.error("Failed to connect to MongoDB", err);
            await new Promise(res => setTimeout(res, 3000));
        }
    }
}

initialize();

/* Useful functions for parsing requests and sending responses*/

function sendJSONResponse(response, statusCode, data) {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(data));
}

function sendResponse(response, statusCode) {
    response.statusCode = statusCode;
    response.end();
}

async function parseRequestBodyJSON(request) {
    return new Promise((resolve, reject) => {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (error) {
                console.error(`Error Parsing JSON: ${error}`);
                reject(error);
            }
        });
    })
};

// listen for requests:

server.on("request", async (request, response) => {
    const parsedUrl = url.parse(request.url, true);

    let success;
    let data;

});