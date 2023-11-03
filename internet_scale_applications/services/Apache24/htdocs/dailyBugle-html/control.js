
/* Endpoints */

const endpoints = {
    "login": "/api/dailyBugle/signIn",
    "signUp": "/api/dailyBugle/signUp",
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

        if (!response.ok) {
            console.log(`Unknown Error, POST to ${apiUrl} -> Error Code: ${response.status}, Status: ${response.statusText}`);
            return false;
        }

        return true;

    } catch (error) {
        console.log(`Error Handling Promise in apiPOSTRequest: ${error}`);
        return false;
    }
}


async function validateLogin() {

    let data = {
        "username": document.getElementById("usernameSignup").value,
        "password": document.getElementById("passwordLogin").value
    }

    const success = await apiPOSTRequest(endpoints['login'], data);

    if (success) {
        window.location.href = "./dailyBugle/";
    } else {
        console.log("Error Logging User In, gonna flesh this out more later");
    }

}

async function validateSignup() {

    let username = document.getElementById("usernameSignup").value;
    let password = document.getElementById("passwordSignup").value;
    let checkPassword = document.getElementById("checkPasswordSignup").value;


    let data;

    if (password === checkPassword) {
        data = {
            "username": username,
            "password": password
        }
    } else {
        console.log("Passwords are not the same");
        return 0;
    }

    const success = await apiPOSTRequest(endpoints['signUp'], data)

    if (success) {
        console.log(`User ${username} successfully signed up!`);
        window.location.href = "./dailyBugle/"
    } else {
        console.log(`Error signing up user ${username}`);
    }

}



/* Functions called from DOM :*/

function toggleLogin() {

    console.log("Function works!");

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