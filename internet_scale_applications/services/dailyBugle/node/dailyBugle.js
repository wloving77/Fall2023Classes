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

// mongo server logic, note the host, these are specific to docker/dev
const mongoProdHost = "mongo-container";
const mongoDevHost = "127.0.0.1";
const mongoPort = 27017;
const mongoUrl = `mongodb://${mongoDevHost}:${mongoPort}`;

const Mongod = new MongoClient(mongoUrl);
const db = "dailyBugle";
const collections = {
    "stories": "stories",
    "comments": "comments",
};

//initialize server, begin listening, retry 3 times if failing.
async function initialize() {
    let retries = 3;
    while (retries != 0) {
        try {
            console.log("Connecting to MongoDB...");
            await Mongod.connect();
            console.log("Connected to MongoDB.");

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


/* Backend Logic Begins: */

server.on("request", async (request, response) => {

    const parsedUrl = url.parse(request.url, true);

    if (request.method == "GET") {
        switch (parsedUrl.pathname) {
            case "/getStories":
                await getStories(response);
                break;
            case "/getComments":
                await getComments(response);
                break;

        }
    }
    else if (request.method == "POST") {
        switch (parsedUrl.pathname) {
            case "/createStory":
                await createStory(request, response);
                break;
            case "/deleteStory":
                await deleteStory(request, response);
                break;
            case "/createComment":
                await createComment(request, response);
                break;
        }
    }

});


async function getStories(response) {

    const storiesCollection = Mongod.db(db).collection(collections['stories']);

    const stories = await storiesCollection.find({}).sort({ title: 1 }).toArray();

    sendJSONResponse(response, 200, stories);

}

async function getComments(response) {

    const commentsCollection = Mongod.db(db).collection(collections['comments']);

    const comments = await commentsCollection.find({}).sort({ comment: 1 }).toArray();

    return sendJSONResponse(response, 200, comments);

}


async function createStory(request, response) {

    const json = await parseRequestBodyJSON(request);

    const story = {
        "title": json['storyTitle'],
        "content": json['storyContent']
    }

    const storiesCollection = Mongod.db(db).collection(collections['stories']);

    await storiesCollection.insertOne(story);

    return sendJSONResponse(response, 200, { message: `Story: ${story['title']}, Created!` });

}

async function deleteStory(request, response) {

    const json = await parseRequestBodyJSON(request);

    if (!json.adminUser) {
        return sendJSONResponse(response, 401, { message: "Unauthorized to Perform This Action" });
    }

    const storyCollection = Mongod.db(db).collection(collections['stories']);
    const commentsCollection = Mongod.db(db).collection(collections['comments']);

    await commentsCollection.deleteMany({ story_id: new ObjectId(json.story_id) });
    await storyCollection.deleteOne({ _id: new ObjectId(json.story_id) });

    return sendJSONResponse(response, 200, { message: `Story with id: ${json.story_id} successfully deleted` });

}

async function createComment(request, response) {

    const data = await parseRequestBodyJSON(request);

    const comment = {
        username: data.username,
        story_id: new ObjectId(data.story_id),
        comment: data.comment,
    }

    const commentsCollection = Mongod.db(db).collection(collections['comments']);

    await commentsCollection.insertOne(comment);

    return sendJSONResponse(response, 200, { message: `User ${data.username}'s comment ${data.comment} successfully submitted!` });

}