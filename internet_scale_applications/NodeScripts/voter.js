/*
Server Logic:
*/

const http = require("http");
const url = require("url");
const { MongoClient } = require('mongodb');

const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());

app.listen(port, "localhost", () => {
    console.log("Listening on localhost:" + port);
});

const mongoUrl = "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);


const dbname = "voter";

let db;

//establish mongodb connection to be used in the endpoints

client.db(dbname).then((err, db) => {
    if (err) {
        console.log("Error establishing Database Connection");
    } else {
        return db;
    }
})

db = client.db(dbname);

let collection = (db.collection("candidates"));

collection.find({}).toArray().then(result => {
    console.log(result);
})