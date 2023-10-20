/*
Server Logic:
*/

const http = require("http");
const url = require("url");
const { MongoClient } = require('mongodb');

const PORT = 3001;
const server = http.createServer();

server.listen(PORT, () => {
    console.log(`Server Listening on http://localhost:${PORT}`);
});


/* GET Requests Below: */
server.on("request", async (request, response) => {
    const parsedUrl = url.parse(request.url, true);

    let data;
    if (request.method == "GET") {
        switch (parsedUrl.pathname) {
            case "/candidates":
                data = await getCandidates();
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(data));
                break;
            case "/voters":
                data = await getVoters();
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(data));
                break;
            case "/":
                console.log(`Nothing to Return for Case ${parsedUrl.pathname}`);
                response.statusCode = 404;
                response.end();
                break;
        }
    }
});

/* POST Requests Below: */
server.on("request", async (request, response) => {
    const parsedUrl = url.parse(request.url, true);

    if (request.method == "POST") {
        let data = request.json();
        switch (parsedUrl.pathname) {
            case "/addVoter":
                let success = await addVoter(data);
                if (success == 1) {
                    response.statusCode = 200;
                    response.end();
                } else {
                    response.statusCode = 500;
                    response.end();
                }
                break;
        }
    }
});



// Functions that talk to Database:

const mongoPort = 27017;
const mongoHost = "localhost";
const mongoUrl = `mongodb://${mongoHost}:${mongoPort}`;
const db = "voter";



async function getCandidates() {
    const collection = "candidates";

    const client = new MongoClient(mongoUrl);
    const database = client.db(db);
    const candidates = database.collection(collection);

    return candidates.find({}).sort({ name: 1 }).toArray();

}


async function getVoters() {
    const collection = "voters";

    const client = new MongoClient(mongoUrl);
    const database = client.db(db);
    const voters = database.collection(collection);

    return voters.find({}).sort({ name: 1 }).toArray();

}


//return 1, success
//return 0, failure
async function addVoter(voter) {
    const collection = "voters";

    const client = new MongoClient(mongoUrl);
    const database = client.db(db);
    const voters = database.collection(collection);

    if (voter['name'] && voter['votes_avail']) {
        voters.insertOne(voter);
    } else {
        console.log("Data format incorrect, rejecting insert attempt");
        return 0;
    }

    return 1;
}