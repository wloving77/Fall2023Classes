
/* Global State management here */

let modals = document.getElementsByClassName("modal");

for (let i = 0; i < modals.length; i++) {
    modals[i].style.display = "none";
}

window.onclick = function (event) {
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}

// all API endpoints will be in this object:
let endpoints = {
    "candidates": "/api/voting/candidates",
    "voters": "/api/voting/voters",
    "addVoter": "/api/voting/addVoter",
    "deleteVoter": "/api/voting/deleteVoter",
    "addCandidate": "/api/voting/addCandidate",
    "deleteCandidate": "/api/voting/deleteCandidate",
    "castVote": "/api/voting/castVote",
}


const intervalId1 = setInterval(function () { fetchAndDisplayVoters('voterTable'); }, 1000);
const intervalId2 = setInterval(function () { fetchAndDisplayCandidates('candidateTable'); }, 1000);


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

function displayVoters(voters, location) {
    let voterTable = document.getElementById(location);

    if (!voters || !voterTable) {
        console.error("Voters, or VoterTable invalid in displayVoters()");
        return;
    }

    voterTable.querySelector("tbody").innerHTML = "";

    displayData(voters, voterTable, "voter");

    voterTable.style.display = "block";
}

function displayCandidates(candidates, location) {
    let candidateTable = document.getElementById(location);

    if (!candidates || !candidateTable) {
        console.error("Candidates, VoterTable, or candidateTable invalid in displayCandidates()");
        return;
    }

    candidateTable.querySelector("tbody").innerHTML = "";

    if (location == "candidateModalTable") {
        displayData(candidates, candidateTable, "candidateCastVote");
    } else {
        displayData(candidates, candidateTable, "candidate");
    }

    candidateTable.style.display = "block";

}

// function purely for the purpose of displaying either the voter or candidate table.
function displayData(data, table, type) {

    for (let i = 0; i < data.length; i++) {
        let newRow = document.createElement("tr");
        let name = document.createElement("td");
        let numVotes = document.createElement("td");
        let id = document.createElement("td");

        //populate shared fields, id is invisible just because I need to be able to query it:
        name.innerHTML = data[i].name;
        id.innerHTML = data[i]._id;
        id.style.display = "none";

        //add the modal logic for displaying the voter modal once a voter is selected:
        switch (type) {
            case "candidate":
                numVotes.innerHTML = data[i].votes;
                newRow.addEventListener("click", function () { handleCandidateClick(name.innerHTML, numVotes.innerHTML, id.innerHTML) })
                break;
            case "candidateCastVote":
                numVotes.innerHTML = data[i].votes;
                newRow.addEventListener("click", function () { castVote(name.innerHTML, id.innerHTML) })
                break;
            case "voter":
                numVotes.innerHTML = data[i].votes_avail;
                newRow.addEventListener("click", function () { handleVoterClick(name.innerHTML, numVotes.innerHTML, id.innerHTML) });
                break;
        }

        newRow.classList.add("tableRow");
        newRow.appendChild(name);
        newRow.appendChild(numVotes);
        newRow.appendChild(id);


        table.querySelector("tbody").appendChild(newRow);

    }
}

//cast a vote for a candidate
async function castVote(candidateName, candidateId) {

    //data for the voter casting the vote
    const voterName = document.getElementById("voterNameField").innerHTML;
    const voterId = document.getElementById("voterIdField").innerHTML;

    let data = {
        voterId: voterId,
        candidateId: candidateId,
    }

    const apiUrl = endpoints['castVote'];

    const success = await apiPOSTRequest(apiUrl, data);

    toggleModalDisplay('modalDeleteVoter');

    if (success) {
        console.log(`Voter: ${voterName} successfully voted for ${candidateName}`);
        return true;
    } else {
        console.error(`Unknown backend error processing vote for candidate: ${candidateName} from voter ${voterName}`);
        return false;
    }

}

/* Functions Called from DOM */

function fetchAndDisplayVoters(location) {
    apiGETRequest(endpoints['voters']).then(data => {
        displayVoters(data, location);
    }).catch(err => {
        console.error("Error in fetchAndDisplayVoters()" + err);
    });
}


function fetchAndDisplayCandidates(location) {
    apiGETRequest(endpoints['candidates']).then(data => {
        displayCandidates(data, location);
    }).catch(err => {
        console.error("Error Displaying Candidates " + err);
    })
}


async function addNewVoter() {

    const voterNameInput = document.getElementById("voterName");
    const voterCountInput = document.getElementById("numVotes");

    const voterName = voterNameInput.value;
    let voteCount = Number(voterCountInput.value);

    if (!voterName || !voterName.trim() || !voteCount) {
        console.log("No Voter Name Provided or invalid voteCount, Exiting");
        return 0;
    }

    if (voteCount <= 0) {
        voteCount = 1;
    }

    //prepare data for request. 
    let data = {
        name: voterName,
        votes_avail: voteCount,
    }

    const apiUrl = endpoints['addVoter'];
    const success = await apiPOSTRequest(apiUrl, data);

    if (success) {
        fetchAndDisplayVoters("voterTable");
    } else {
        console.error(`Failed to Add New Voter`);
    }

    //wipeout votername field and toggle the modal
    voterNameInput.value = "";
    toggleModalDisplay("modalVoter");
}


async function deleteVoter() {
    const voterName = document.getElementById("voterNameField").innerHTML;
    const votesAvail = document.getElementById("votesAvailableField").innerHTML;
    const voterId = document.getElementById("voterIdField").innerHTML;

    if (!voterName || !votesAvail || !voterId) {
        console.error("Something went wrong parsing Span's from delete voter modal, exiting.");
        return 0;
    }

    let data = {
        name: voterName,
        votes_avail: votesAvail,
        _id: voterId,
    }

    const apiUrl = endpoints['deleteVoter'];
    const success = await apiPOSTRequest(apiUrl, data);

    if (success) {
        fetchAndDisplayVoters("voterTable");
    } else {
        console.error(`Failed to Add New Voter`);
    }

    toggleModalDisplay("modalDeleteVoter");

}

//not very DRY I know, but the refactor would have been obnoxious
async function addNewCandidate() {

    const candidateNameInput = document.getElementById("candidateName");

    const candidateName = candidateNameInput.value;

    if (!candidateName || !candidateName.trim()) {
        console.log("No Voter Name Provided or invalid voteCount, Exiting");
        return 0;
    }

    //prepare data for request. 
    let data = {
        name: candidateName,
        votes: 0
    }

    const apiUrl = endpoints['addCandidate'];
    const success = await apiPOSTRequest(apiUrl, data);

    if (success) {
        fetchAndDisplayCandidates("candidateTable");
    } else {
        console.error(`Failed to Add New Candidate`);
    }

    //wipeout votername field and toggle the modal
    candidateNameInput.value = "";
    toggleModalDisplay("modalCandidate");
}


async function deleteCandidate() {

    const candidateName = document.getElementById("candidateNameField").innerHTML;
    const candidateVotes = document.getElementById("candidateVotesField").innerHTML;
    const candidateId = document.getElementById("candidateIdField").innerHTML;

    if (!candidateName || !candidateVotes || !candidateId) {
        console.error("Something went wrong parsing Span's from delete voter modal, exiting.");
        return 0;
    }

    let data = {
        name: candidateName,
        votes: candidateVotes,
        _id: candidateId,
    }

    const apiUrl = endpoints['deleteCandidate'];
    const success = await apiPOSTRequest(apiUrl, data);

    if (success) {
        fetchAndDisplayCandidates("candidateTable");
    } else {
        console.error(`Failed to Add New Voter`);
    }

    toggleModalDisplay("modalDeleteCandidate");

}


/* Utility Style Functions (click events, etc):*/

//stub for now
function toggleModalDisplay(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = modal.style.display == "none" ? "block" : "none";
}

//show voter-specific modal on a voter click
function handleVoterClick(name, votes_avail, voterId) {
    document.getElementById("voterNameField").innerHTML = name;
    document.getElementById("votesAvailableField").innerHTML = votes_avail;
    document.getElementById("voterIdField").innerHTML = voterId;
    fetchAndDisplayCandidates('candidateModalTable')
    toggleModalDisplay("modalDeleteVoter");
}

function handleCandidateClick(name, votes, candidateId) {
    document.getElementById("candidateNameField").innerHTML = name;
    document.getElementById("candidateVotesField").innerHTML = votes;
    document.getElementById("candidateIdField").innerHTML = candidateId;
    toggleModalDisplay('modalDeleteCandidate');
    return 0;
}