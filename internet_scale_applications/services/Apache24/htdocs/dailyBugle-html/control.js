/* API Request FUNCTIONS */

async function apiGETRequestBugle(apiUrl) {

    return fetch(apiUrl, { method: "GET" })
        .then(response => {
            if (!response.ok) {
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

async function apiPOSTRequestBugle(apiUrl, dataToSend) {

    return fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
    }).then(response => {
        if (!response.ok) {
            console.log(`Unknown Error, POST to ${apiUrl} -> Error Code: ${response.status}, Status: ${response.statusText}`);
            return null;
        }
        return response.json();
    }).catch(error => {
        console.log(`Error Handling Promise in apiPOSTRequest: ${error}`);
        return null;
    }
    )
}


const endpointsBugle = {
    "getStories": "/api/dailyBugle/getStories",
    "getComments": "/api/dailyBugle/getComments",
    "createStory": "/api/dailyBugle/createStory",
    "deleteStory": "/api/dailyBugle/deleteStory",
    "createComment": "/api/dailyBugle/createComment",
    "adEvent": "/api/dailyBugle/trackAd"
}


/* API Functions:*/


//this index keeps track of what story we are currently displaying
var globalStoryIndex = 0;
var globalStories;

var globalComments;

async function loadStories() {

    const apiUrl = endpointsBugle['getStories'];

    globalStories = await apiGETRequestBugle(apiUrl);

    if (globalStories.length == 0) {
        console.log("No Stories!");
        return;
    }

    await loadComments();
    displayComments();

    document.getElementById("titleBox").innerHTML = globalStories[0].title;
    document.getElementById("contentBox").innerHTML = globalStories[0].content;

}

async function nextStory() {

    if (globalStoryIndex <= globalStories.length - 2) {
        globalStoryIndex++;
        displayComments();
        document.getElementById("titleBox").innerHTML = globalStories[globalStoryIndex].title;
        document.getElementById("contentBox").innerHTML = globalStories[globalStoryIndex].content;
    }

}

async function previousStory() {

    if (globalStoryIndex > 0) {
        globalStoryIndex--;
        displayComments();
        document.getElementById("titleBox").innerHTML = globalStories[globalStoryIndex].title;
        document.getElementById("contentBox").innerHTML = globalStories[globalStoryIndex].content;
    }
}


async function createStory() {

    const title = document.getElementById("storyTitle").value;
    const content = document.getElementById("storyText").value;

    if (title == "" || content == "") {
        console.log("Cannot create empty stories");
        return;
    }

    const postData = {
        "storyTitle": title,
        "storyContent": content,
    }

    const apiUrl = endpointsBugle['createStory']

    const response = await apiPOSTRequestBugle(apiUrl, postData);

    toggleModalDisplay("Story");

    document.getElementById("storyTitle").value = "";
    document.getElementById("storyText").value = "";

    await loadStories();

}

async function deleteStory() {

    const payload = {
        "story_id": globalStories[globalStoryIndex]._id,
        "adminUser": credentials.adminUser,
    }

    console.log(payload);

    const apiUrl = endpointsBugle['deleteStory'];

    const response = await apiPOSTRequestBugle(apiUrl, payload);

    await loadStories();
    await loadComments();
    displayComments();

}


async function loadComments() {

    const apiUrl = endpointsBugle['getComments'];

    globalComments = await apiGETRequestBugle(apiUrl);

}

function displayComments() {

    const commentList = document.getElementById("commentList");

    commentList.innerHTML = "";

    for (let i = 0; i < globalComments.length; i++) {

        if (globalComments[i].story_id == globalStories[globalStoryIndex]._id) {

            const listItem = document.createElement("li");

            listItem.innerHTML = `User <strong>${globalComments[i].username}</strong> Commented: <strong>${globalComments[i].comment}</strong>`;

            const lineBreak = document.createElement("br");

            commentList.appendChild(listItem);
            commentList.appendChild(lineBreak);
        }

    }
}

//retarded ass name to solve a retarded ass problem
async function deployComment() {

    const comment = document.getElementById("commentText").value;

    if (comment == "") {
        console.log("Cannot comment nothing");
        return;
    }

    const payload = {
        "username": credentials.username,
        "story_id": globalStories[globalStoryIndex]._id,
        "comment": comment
    }

    const apiUrl = endpointsBugle['createComment'];

    response = await apiPOSTRequestBugle(apiUrl, payload);

    toggleModalDisplay("Comment");

    document.getElementById("commentText").value = "";

    await loadComments();
    displayComments();

}



/* Admin Logic: */

var intervalAdmin = setInterval(checkAdmin, 2000);

function checkAdmin() {
    if (credentials.username != undefined && credentials.adminUser != undefined) {
        if (credentials.adminUser) {
            let adminElements = document.getElementsByClassName("adminUser");

            for (let i = 0; i < adminElements.length; i++) {
                adminElements[i].style.display = "block";
            }
        }
    }
}


/* Logic for rotating advertisements: */

var intervalImage = setInterval(rotateImage, 2000);
var globalImgIndex = 1;
var globalAdImages = ['./advertisements/bose.jpeg', './advertisements/cool-car.jpeg', './advertisements/dog-food.jpeg',
    './advertisements/hydroflask.jpeg', './advertisements/kubernetes.webp'];

function rotateImage() {

    if (globalImgIndex > globalAdImages.length) {
        globalImgIndex = 0
    }
    document.getElementById("advertisementImage").setAttribute("src", globalAdImages[globalImgIndex]);

    globalImgIndex++;


}

async function trackAdEvent() {

    const payload = {
        "username": credentials.username,
        "advertisement": globalAdImages[globalImgIndex],
    }

    const apiUrl = endpointsBugle['adEvent'];

    const response = await apiPOSTRequestBugle(apiUrl, payload);

    console.log(response);

}


/* Modal Logic:*/


// example: "Story", "Comment"
function initializeModal(modalType) {

    var modal = document.getElementById(`modalCreate${modalType}`);

    var btn = document.getElementById(`create${modalType}`);

    var span = document.getElementById(`close${modalType}`);

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

}

// example: "Story", "Comment"
function toggleModalDisplay(modalType) {
    const modal = document.getElementById(`modalCreate${modalType}`);
    modal.style.display = modal.style.display == "none" ? "block" : "none";
}


/* Initialization functions to run immediately*/
initializeModal("Story");
initializeModal("Comment");

let modal1 = document.getElementById("modalCreateStory");
let modal2 = document.getElementById("modalCreateComment");

function closeModal(event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    } else if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

window.addEventListener("click", closeModal);


loadStories();
