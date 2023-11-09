/*
Server Logic:
*/

const http = require("http");
const url = require("url");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require('mongodb');

// node server logic, note the ports and host being listened on, this is for docker compatibility
const nodeHost = "0.0.0.0";
const nodePort = 3003;
const server = http.createServer();

// mongo server logic, note the ports being run on, these are specific to docker
const mongoProdHost = "mongo-container";
const mongoLocalHost = "127.0.0.1";
const mongoPort = 27017;
const mongoUrl = `mongodb://${mongoLocalHost}:${mongoPort}`;

const Mongod = new MongoClient(mongoUrl);
const db = "authentication";
const authCollection = "user";

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

function sendJSONResponse(response, statusCode, data, headers) {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');

    for (const headerName in headers) {
        response.setHeader(headerName, headers[headerName]);
    }

    console.log(data);

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

// listen for auth requests:
server.on("request", async (request, response) => {

    const parsedUrl = url.parse(request.url, true);

    if (request.method == "POST") {
        switch (parsedUrl.pathname) {
            case "/signUp":
                await handleSignUp(request, response);
                break;
            case "/signIn":
                await handleSignIn(request, response);
                break;
            case "/signOut":
                await handleSignOut(request, response);
                break;
            case "/sessionToken":
                await handleSessionToken(request, response);
                break;
        }
    }

});


const SecretKey = "ThisIsAStrongSecretKeyForTesting123";

// Function to generate a JWT session token
function generateToken(user) {
    return jwt.sign({ userId: user.id }, SecretKey, { expiresIn: "1h" });
}

async function handleSignUp(request, response) {

    try {

        const { username, password } = await parseRequestBodyJSON(request);

        const database = Mongod.db(db);
        const collection = database.collection(authCollection);

        const userExists = await collection.findOne({ username });

        // if there already exists a user, redirect to login
        if (userExists != null) {
            return sendJSONResponse(response, 401, { message: "Signup Failed, User Already Exists" }, {});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { username, password: hashedPassword };
        await collection.insertOne(newUser);

        //send session token back
        const token = generateToken(newUser);
        const cookieHeader = {
            "Set-Cookie": `williamToken_token=${token}; Path=/;`
        };

        return sendJSONResponse(response, 200, { message: "Signup Succeeded, Welcome to my App!" }, cookieHeader);

    } catch (error) {
        console.error("Server Error: " + error);
        return sendJSONResponse(response, 500, { message: "An unexpected error occured, please try again later" }, {});
    }
}


async function handleSignIn(request, response) {

    try {

        const { username, password } = await parseRequestBodyJSON(request);

        const database = Mongod.db(db);
        const collection = database.collection(authCollection);

        const User = await collection.findOne({ username: username });

        if (User == null) {
            return sendJSONResponse(response, 402, { message: "User does not exist, please signup" }, {});
        }

        let authenticated = await bcrypt.compare(password, User.password);

        if (authenticated) {
            //send session token back
            const token = generateToken(User);
            const cookieHeader = {
                "Set-Cookie": `williamToken_token=${token}; Path=/;`
            };

            return sendJSONResponse(response, 200, { message: "Login Successful, Welcome to my App!" }, cookieHeader);
        } else {
            return sendJSONResponse(response, 401, { message: "Login Failed, Please Check Your Credentials" }, {});
        }

    } catch (error) {
        console.error("Server Error: " + error);
        return sendJSONResponse(response, 500, { message: "An unexpected error occured, please try again later" }, {});
    }

}

async function handleSignOut(request, response) {

    //this does nothing atm
    sendJSONResponse(response, 200, { message: "Success: User Signed Out" }, {});

}


/* Cookie Parsing Logic for authenticated routes: */

async function handleSessionToken(request, response) {

    let cookies;

    try {
        cookies = await parseCookies(request);
    } catch (error) {
        console.error("Error parsing cookies: " + error);
        return sendJSONResponse(response, 400, { message: 'Bad Request: Error parsing cookies' }, {});
    }
    // Check if the dailtBugle_token cookie is present
    if (!cookies.williamToken_token) {
        return sendJSONResponse(response, 401, { message: "Unauthorized: Token Not Provided" }, {});
    }

    const token = cookies.williamToken_token;

    try {
        // Verify the token using the same secret key used for signing
        jwt.verify(token, SecretKey);
        return sendJSONResponse(response, 200, { message: "Authorized: Session Token Valid" }, {});
    } catch (error) {
        return sendJSONResponse(response, 403, { message: "Forbidden: Invalid Session Token" }, {});
    }
}

// Function to parse cookies from the request headers
async function parseCookies(request) {
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
        return {};
    }

    const cookies = {};
    const cookiePairs = cookieHeader.split(";");

    for (const pair of cookiePairs) {
        const [name, value] = pair.trim().split("=");
        cookies[name] = value;
    }

    return cookies;
}
