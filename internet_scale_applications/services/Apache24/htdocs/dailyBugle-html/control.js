
/* Functions to run on page load: */

window.onload = checkForSessionToken;

/* Endpoints */

const endpoints = {
    "login": "/api/dailyBugle/signIn",
    "signUp": "/api/dailyBugle/signUp",
    "signOut": "/api/dailyBugle/signOut",
    "sessionAuth": "/api/dailyBugle/sessionAuth"
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
            document.getElementById("errorElement").innerHTML = "An Error Occured";
            console.log(`Error Handling Promise in apiGETRequest: ${error}`);
            return null;
        })
}

async function apiPOSTRequest(apiUrl, dataToSend) {

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
        })

        return response;

    } catch (error) {
        console.error(`Error Handling Promise in apiPOSTRequest: ${error}`);
        throw error;
    }
}


async function validateLogin() {

    let data = {
        "username": document.getElementById("usernameLogin").value,
        "password": document.getElementById("passwordLogin").value
    }

    const response = await apiPOSTRequest(endpoints['login'], data);

    if (response.status == 200) {
        window.location.href = "./dailyBugle/";
    } else if (response.status == 201) {
        console.log("User Doesn't Exist");
    } else if (response.status == 202) {
        console.log("Error Authenticating, Wrong Password");
    } else {
        console.log("Server side error");
    }

}

async function validateSignup() {

    let username = document.getElementById("usernameSignup").value;
    let password = document.getElementById("passwordSignup").value;
    let checkPassword = document.getElementById("confirmPasswordSignup").value;

    let data;

    if (password === checkPassword) {
        data = {
            "username": username,
            "password": password
        }
    } else {
        console.log("Passwords are not the same");
        return;
    }

    const response = await apiPOSTRequest(endpoints['signUp'], data)

    if (response.status == 200) {
        console.log(`User ${username} successfully signed up!`);
        window.location.href = "./dailyBugle/";
    } else if (response.status == 201) {
        console.log(`User: ${username} already exists.`);
    } else {
        console.log("Server-side error processing signup");
    }

}

async function checkForSessionToken() {

    let data = {}

    const response = await apiPOSTRequest(endpoints['sessionAuth'], data);

    if (response.status == 200) {
        window.location.href = "./dailyBugle/";
    } else if (response.status == 201) {
        console.log("No Valid Session Token, Login Normally");
    } else {
        console.log("Server-side error processing session token");
    }
}

/* Functions called from DOM :*/

function toggleLogin() {

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