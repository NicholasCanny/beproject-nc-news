// server.js
const express = require("express");
const app = express();
const apiRouter = require("./api-router");
const endpoints = require("./endpoints.json");
const cors = require("cors");

app.use(cors());

app.use(express.json());

// Root API route
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

// Use API Router
app.use("/api", apiRouter);

// error handling middleware

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ error: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ error: err.message });
  } else {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404).send({ error: "route not found" });
});

app.use((err, req, res, next) => {
  console.log(err, "<<< you haven't handled this error yet");
  res.status(500).send({ error: "internal server error" });
});

module.exports = app;
