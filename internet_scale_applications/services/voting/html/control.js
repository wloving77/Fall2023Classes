// all API endpoints will be in this object:
let endpoints = {
    "candidates": "/api/voting/candidates",
    "voters": "/api/voting/voters",
}
/* API Request FUNCTIONS */

async function apiGETRequest(apiUrl) {

    return fetch(apiUrl, { method: "GET" })
        .then(response => {
            if (!response.ok) {
                console.log(`Unknown Error Fetching from ${apiUrl} -> Error Code: ${response.status}, Status: ${response.statusText}`);
                return null;
            }
            return response.json();
        })
        .catch(error => {
            console.log(`Error Handling Promise in apiGETRequest: ${error}`);
            return null;
        })
}

//stub for now
async function apiPOSTRequest(apiUrl, dataToSend) {
    return 0;
}

/* DOM FUNCTIONS */

//separate module to enforce DRY as we perform the same actions for displaying both candidates and voters

function displayVoters(voters) {
    let voterTable = document.getElementById("voterTable");
    let candidateTable = document.getElementById("candidateTable");

    if (!voters) {
        console.error("Voters variable invalid in displayVoters()");
        return;
    }

    voterTable.querySelector("tbody").innerHTML = "";
    candidateTable.style.display = "none";

    displayData(voters, voterTable, "voter");


    // create a button for adding new voters

    let addButton = document.createElement("button");
    addButton.id = "addVoter";
    addButton.innerHTML = "(+)";
    addButton.onclick(displayVoterModal());
    voterTable.querySelector("tbody").appendChild(addButton);

    voterTable.style.display = "block";
}

function displayCandidates(candidates) {
    let candidateTable = document.getElementById("candidateTable");
    let voterTable = document.getElementById("voterTable");

    if (!candidates) {
        console.error("Candidates variable invalid in displayCandidates()");
        return;
    }

    candidateTable.querySelector("tbody").innerHTML = "";
    voterTable.style.display = "none";

    displayData(candidates, candidateTable, "candidate");

    candidateTable.style.display = "block";

}

// function purely for the purpose of displaying either the voter or candidate table.
function displayData(data, table, type) {

    for (let i = 0; i < data.length; i++) {
        let newRow = document.createElement("tr");
        let name = document.createElement("td");
        let numVotes = document.createElement("td");

        name.innerHTML = data[i].name;

        if (type == "candidate") {
            numVotes.innerHTML = data[i].votes;
        } else {
            numVotes.innerHTML = data[i].votes_avail
        }

        newRow.appendChild(name);
        newRow.appendChild(numVotes)

        newRow.classList.add("tableRow");
        newRow.id = `${type}-${i}`;

        table.querySelector("tbody").appendChild(newRow);

    }
}


/* Functions Called from DOM */

function fetchAndDisplayVoters() {
    apiGETRequest(endpoints['voters']).then(data => {
        displayVoters(data);
    }).catch(err => {
        console.error("Error in fetchAndDisplayVoters()" + err);
    });
}


function fetchAndDisplayCandidates() {
    apiGETRequest(endpoints['candidates']).then(data => {
        displayCandidates(data);
    }).catch(err => {
        console.error("Error Displaying Candidates " + err);
    })
}


//stub for now
function displayVoterModal() {
    return 0;
}