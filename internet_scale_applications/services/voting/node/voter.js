/*
Server Logic:
*/

const http = require("http");
const url = require("url");
const { MongoClient } = require('mongodb');

const PORT = 3001;
const server = http.createServer();

const mongoPort = 27017;
const Host = "localhost";
const mongoUrl = `mongodb://${Host}:${mongoPort}`;
const db = "voter";

const Mongod = new MongoClient(mongoUrl);

//initialize server, begin listening, retry 3 times otherwise.
async function initialize() {
    let retries = 3;
    while (retries) {
        try {
            await Mongod.connect();
            console.log("Connected to MongoDB");

            server.listen(PORT, () => {
                console.log(`Server Listening on http://${Host}:${PORT}`);
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



/* GET Requests Below: */
server.on("request", async (request, response) => {
    const parsedUrl = url.parse(request.url, true);

    let data;
    if (request.method == "GET") {
        switch (parsedUrl.pathname) {
            case "/candidates":
                data = await getCandidates();
                sendJSONResponse(response, 200, data);
                break;
            case "/voters":
                data = await getVoters();
                sendJSONResponse(response, 200, data);
                break;
            case "/":
                console.log(`Nothing to Return for Case ${parsedUrl.pathname}`);
                sendResponse(response, 200);
                break;
        }
    } else if (request.method == "POST") {
        switch (parsedUrl.pathname) {
            case "/addVoter":
                const voter = await parseRequestBodyJSON(request);
                const success = await addVoter(voter);
                if (success) {
                    sendResponse(response, 200);
                } else {
                    sendJSONResponse(response, 400, { error: "Bad Request" });
                }
                break;
            case "/":
                console.log("Nothing to POST/Return for a / Endpoint");
                break;
        }
    }
});



// Functions that talk to Database:


async function getCandidates() {
    const collection = "candidates";

    const database = Mongod.db(db);
    const candidates = database.collection(collection);

    return candidates.find({}).sort({ name: 1 }).toArray();

}


async function getVoters() {
    const collection = "voters";

    const database = Mongod.db(db);
    const voters = database.collection(collection);

    return voters.find({}).sort({ name: 1 }).toArray();

}


//return true, success
//return false, failure
async function addVoter(voter) {
    const collection = "voters";

    const database = Mongod.db(db);
    const voters = database.collection(collection);

    try {
        if (voter['name'] && voter['votes_avail']) {
            await voters.insertOne(voter);
            console.log(`inserted ${JSON.stringify(voter)}`);
            return true;
        } else {
            console.log("Data format incorrect, rejecting insert attempt");
            return false;
        }
    } catch (error) {
        console.log(`Error Inserting Voter: ${error}`);
        return false;
    }
}

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