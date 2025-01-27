const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
// imported in the endpoints.json
// const port = 3000;

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

module.exports = app;
