//initialize voterModal display to none
document.getElementById("modalVoter").style.display = "none";

// all API endpoints will be in this object:
let endpoints = {
    "candidates": "/api/voting/candidates",
    "voters": "/api/voting/voters",
    "addVoter": "/api/voting/addVoter"
}
/* API Request FUNCTIONS */

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

//stub for now
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

/* DOM FUNCTIONS */

//separate module to enforce DRY as we perform the same actions for displaying both candidates and voters

function displayVoters(voters) {
    let voterTable = document.getElementById("voterTable");
    let candidateTable = document.getElementById("candidateTable");

    if (!voters || !voterTable || !candidateTable) {
        console.error("Voters, VoterTable, or candidateTable invalid in displayVoters()");
        return;
    }

    voterTable.querySelector("tbody").innerHTML = "";
    candidateTable.style.display = "none";

    displayData(voters, voterTable, "voter");

    voterTable.style.display = "block";
}

function displayCandidates(candidates) {
    let candidateTable = document.getElementById("candidateTable");
    let voterTable = document.getElementById("voterTable");

    if (!candidates || !candidateTable || !voterTable) {
        console.error("Candidates, VoterTable, or candidateTable invalid in displayCandidates()");
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


async function addNewVoter() {

    const voterNameInput = document.getElementById("voterName");

    const voterName = voterNameInput.value;

    if (voterName == null || !voterName.trim()) {
        console.log("No Voter Name Provided, Exiting");
        return 0;
    }

    //prepare data for request. 
    let data = {
        name: voterName,
        votes_avail: 1,
    }

    const apiUrl = endpoints['addVoter'];
    const success = await apiPOSTRequest(apiUrl, data);



    //wipeout votername and reload index.html:
    if (success) {
        fetchAndDisplayVoters();
    } else {
        console.error(`Failed to Add New Voter`);
    }

    voterNameInput.value = "";
    toggleVoterModalDisplay();
}



//stub for now
function toggleVoterModalDisplay() {
    const modal = document.getElementById("modalVoter");
    modal.style.display = modal.style.display == "none" ? "block" : "none";
}

