/* Endpoints */

const endpoints = {
    "login": "/api/auth/signIn",
    "signUp": "/api/auth/signUp",
    "signOut": "/api/auth/signOut",
    "sessionToken": "/api/auth/sessionToken"
}

/* API Request Utility Functions */

async function apiGETRequest(apiUrl) {

    return fetch(apiUrl, { method: "GET" })
        .then(response => {
            if (!response.ok) {
                document.getElementById("errorElement").innerHTML = "Failed to Load Data";
                console.log(`Unknown Error, GET from ${apiUrl} -> Error Code: ${response.status}, Status: ${response.statusText}`);
                return null;
            }
            return response.json();
        })
        .catch(error => {
            console.log(`Error Handling Promise in apiGETRequest: ${error}`);
            return null;
        })
}

function apiPOSTRequest(apiUrl, dataToSend) {

    return fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
    })
        .then(response => {
            // Parse the JSON response and return the data along with the status
            return response.json().then(message => {
                return {
                    status: response.status,
                    message: message
                };
            });
        })
        .catch(error => {
            // Log the error and pass it on for the calling function to handle
            console.error(`Error Handling Promise in apiPOSTRequest: ${error}`);
            throw error;
        });
}


async function validateLogin() {

    let data = {
        "username": document.getElementById("usernameLogin").value,
        "password": document.getElementById("passwordLogin").value
    }

    if (data['username'] == "" || data['password'] == "") {
        console.log(`Invalid Username or Password`);
        return;
    }

    const response = await apiPOSTRequest(endpoints['login'], data);

    if (response.status == 200) {
        window.location = "/";
    } else if (response.status == 401) {
        console.log(response.message);
    } else if (response.status == 402) {
        console.log(response.message);
    } else {
        console.log(response.message);
    }

}

async function validateSignup() {

    let username = document.getElementById("usernameSignup").value;
    let password = document.getElementById("passwordSignup").value;
    let checkPassword = document.getElementById("confirmPasswordSignup").value;
    let adminCheckbox = document.getElementById("adminCheckbox");

    let data;

    if (password === checkPassword) {
        data = {
            "username": username,
            "password": password,
            "adminCheck": adminCheckbox.checked
        }
    } else {
        console.log("Passwords are not the same");
        return;
    }

    console.log(data['adminCheck'])

    if (data['username'] == "" || data['password'] == "") {
        console.log(`Invalid Username or Password`);
        return;
    }

    const response = await apiPOSTRequest(endpoints['signUp'], data)

    if (response.status == 200) {
        window.location = "/";
    } else if (response.status == 401) {
        console.log(response.message);
    } else {
        console.log(response.message);
    }

}

async function checkForSessionToken() {

    let data = {}

    const response = await apiPOSTRequest(endpoints['sessionToken'], data);

    console.log(response.message);

    if (response.status == 200) {
        return true;
    } else {
        return false;
    }

}


function clearSessionTokenCookie() {

    const cookies = document.cookie.split(";");

    // Iterate through the cookies to find and remove the "session_token" cookie
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.startsWith("williamToken_token=")) {
            const cookieName = cookie.split("=")[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            break;
        }
    }
}

async function signOut() {

    //invalidate cookie

    clearSessionTokenCookie();

    data = {};

    const signOutUrl = endpoints['signOut'];

    const response = await apiPOSTRequest(signOutUrl, data);

    if (response.status == 200) {
        window.location = "/services/auth";
    } else if (response.status == 401) {
        console.log(response.message);
    } else {
        console.log(response.message);
    }


}

/* Functions called from DOM :*/

function toggleLoginView() {

    let loginDiv = document.getElementById("loginContainer");
    let signupDiv = document.getElementById("signupContainer");

    let swapBtn = document.getElementById("swapButton");

    //login mode: state=true
    //signup mode: state=false
    let state = signupDiv.style.display == "none";

    // swap to whatever the opposite state is, if login mode, go to signup mode and vice versa 

    loginDiv.style.display = state == true ? "none" : "block";
    signupDiv.style.display = state == true ? "block" : "none";

    //modify button: 

    swapBtn.querySelector("h3").innerHTML = state == true ? "Already Have an Account?" : "Make an Account?";
    swapBtn.querySelector("button").innerHTML = state == true ? "Login" : "Signup";

}