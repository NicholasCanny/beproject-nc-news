const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
// imported endpoints.json
// const port = 3000;
const getTopics = require("./controller");

// const devData = require("../db/data/development-data/index.js");
// const testData = require("../db/data/test-data/index.js");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

// error handling middleware

app.use((err, req, res, next) => {
  console.log(err, "<<< you havent handled this error yet");
  res.status(500).send({ error: "Internal Server Error" });
});

module.exports = app;
