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
            await getCandidates();
            break;
        case "/candidates/voters":
            await getCandidatesWithBallots();
            break;
    }
});


const mongoUrl = "mongodb://localhost:27017";
const db = "voter";

async function getCandidates() {
    const collection = "candidates";

    const client = new MongoClient(mongoUrl);
    const database = client.db(db);
    const candidates = database.collection(collection);

    return candidates.find({}).toArray();

}


async function getCandidatesWithBallots() {
    const collection = "can"

}



//establish mongodb connection to be used in the endpoints

db = client.db(dbname);

let collection = (db.collection("candidates"));

collection.find({}).toArray().then(result => {
    console.log(result);
})