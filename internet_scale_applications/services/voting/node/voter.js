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


server.on("request", async (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    switch (parsedUrl.pathname) {
        case "/candidates":
            if (request.method == "GET") {
                const data = await getCandidates();
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(data));
                break;
            }
        case "/voters":
            if (request.method == "GET") {
                const data = await getVoters();
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(data));
                break;
            }
    }
});


const mongoUrl = "mongodb://localhost:27017";
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