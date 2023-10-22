/*
Server Logic:
*/

const http = require("http");
const url = require("url");
const { MongoClient, ObjectId } = require('mongodb');

const HOST = "localhost";
const PORT = 3001;
const server = http.createServer();

const mongoPort = 27017;
const mongoUrl = `mongodb://${HOST}:${mongoPort}`;
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
                console.log(`Server Listening on http://${HOST}:${PORT}`);
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

//initialize server listening on host:port
initialize();



/* GET Requests Below: */
server.on("request", async (request, response) => {
    const parsedUrl = url.parse(request.url, true);

    let success;

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
                data = await parseRequestBodyJSON(request);
                success = await addVoter(data);
                if (success) {
                    sendResponse(response, 200);
                } else {
                    sendJSONResponse(response, 400, { error: "Bad Request" });
                }
                break;
            case "/deleteVoter":
                data = await parseRequestBodyJSON(request);
                success = await deleteVoter(data);
                if (success) {
                    sendResponse(response, 200);
                } else {
                    sendJSONResponse(response, 400, { error: "Bad Request" });
                }
                break;
            case "/addCandidate":
                data = await parseRequestBodyJSON(request);
                success = await addCandidate(data);
                if (success) {
                    sendResponse(response, 200);
                } else {
                    sendJSONResponse(response, 400, { error: "Bad Request" });
                }
                break;
            case "/deleteCandidate":
                data = await parseRequestBodyJSON(request);
                success = await deleteCandidate(data);
                if (success) {
                    sendResponse(response, 200);
                } else {
                    sendJSONResponse(response, 400, { error: "Bad Request" });
                }
                break;
            case "/castVote":
                data = await parseRequestBodyJSON(request);
                success = await castVote(data['voterId'], data['candidateId']);
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
        if (voter['name'] != null && voter['votes_avail'] != null) {
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

// return true, success
// return false, failure
async function deleteVoter(voter) {
    const voterCollection = "voters";
    const candidateCollection = "candidates";
    const voteTrackingCollection = "votes";

    const database = Mongod.db(db);

    const voters = database.collection(voterCollection);
    const candidates = database.collection(candidateCollection);
    const votes = database.collection(voteTrackingCollection);

    try {
        const queryVoter = { "_id": new ObjectId(voter['_id']) }; // Convert string to ObjectId
        const queryVotes = { "voterId": new ObjectId(voter['_id']) };

        //get all candidates corresponding to this voter
        const candidateVotes = await votes.find(queryVotes).toArray();

        //decrement the number of votes for this candidate as we are removing the voter:
        for (let i = 0; i < candidateVotes.length; i++) {
            await candidates.updateOne({ "_id": new ObjectId(candidateVotes[i].candidateId) }, { $inc: { votes: -1 } });
        }

        const result1 = await voters.deleteOne(queryVoter);
        const result2 = await votes.deleteOne(queryVotes);

        if (result1 && result2) {
            console.log(`Successfully deleted voter with Name: ${voter['name']} and id: ${voter['_id']} and updated votes for the corresponding candidate.`);
            return true;
        } else {
            console.log('No voter found with that id or an issue with the candidate updating.');
            return false;
        }
    } catch (err) {
        console.error(`An error occurred: ${err}`);
        return false;
    }

}

async function addCandidate(candidate) {
    const collection = "candidates";

    const database = Mongod.db(db);
    const candidates = database.collection(collection);

    try {
        if (candidate['name'] != null && candidate['votes'] != null) {
            await candidates.insertOne(candidate);
            console.log(`inserted ${JSON.stringify(candidate)}`);
            return true;
        } else {
            console.log("Data format incorrect, rejecting insert attempt");
            return false;
        }
    } catch (error) {
        console.log(`Error Inserting Candidate: ${error}`);
        return false;
    }
}

async function deleteCandidate(candidate) {
    const voterCollection = "voters";
    const candidateCollection = "candidates";
    const voteTrackingCollection = "votes";

    const database = Mongod.db(db);

    const voters = database.collection(voterCollection);
    const candidates = database.collection(candidateCollection);
    const votes = database.collection(voteTrackingCollection);

    try {
        const queryCandidate = { "_id": new ObjectId(candidate['_id']) }; // Convert string to ObjectId
        const queryVotes = { "candidateId": new ObjectId(candidate['_id']) };

        //get all candidates corresponding to this voter
        const candidateVotes = await votes.find(queryVotes).toArray();

        //decrement the number of votes for this candidate as we are removing the voter:
        for (let i = 0; i < candidateVotes.length; i++) {
            await voters.updateOne({ "_id": new ObjectId(candidateVotes[i].voterId) }, { $inc: { votes_avail: 1 } });
        }

        const result1 = await candidates.deleteOne(queryCandidate);
        const result2 = await votes.deleteMany(queryVotes);

        if (result1 && result2) {
            console.log(`Successfully deleted candidate with Name: ${candidate['name']} and id: ${candidate['_id']} and updated votes for the corresponding voters.`);
            return true;
        } else {
            console.log('No candidate found with that id or an issue with the voter updating.');
            return false;
        }
    } catch (err) {
        console.error(`An error occurred: ${err}`);
        return false;
    }

}


async function castVote(voterId, candidateId) {

    //essentially bad request
    if (!voterId || !candidateId) {
        return false;
    }

    //parse the strings using objectid:
    const voterInfo = new ObjectId(voterId);
    const candidateInfo = new ObjectId(candidateId);

    const database = Mongod.db(db);

    //three collections to track each of voters, candidates, and votes for the candidates
    const voterCollection = database.collection("voters");
    const candidateCollection = database.collection("candidates");
    const voteTrackingCollection = database.collection("votes");


    try {
        const voter = await voterCollection.findOne({ "_id": voterInfo });

        // update voter votes_avail only if not already 0
        if (voter.votes_avail <= 0) {
            //early return for no remaining votes
            return true;
        } else {
            //update number of available votes for voter
            await voterCollection.updateOne({ "_id": voterInfo }, { $inc: { votes_avail: -1 } });

            // update the number of votes for candidate
            await candidateCollection.updateOne({ "_id": candidateInfo }, { $inc: { votes: 1 } });

            //create vote object
            const newVote = {
                voterId: voterInfo,
                candidateId: candidateInfo,
                timestamp: new Date(),
            }

            await voteTrackingCollection.insertOne(newVote);

            return true;
        }

    } catch (error) {
        console.log("Error in castVote: " + error);
        return false;
    }




}


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