const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
// imported endpoints.json

const { getTopics, getArticleByArticleId } = require("./controller");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByArticleId);

// error handling middleware

// General error-handling middleware
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ error: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message === "article not found") {
    res.status(404).send({ error: "article not found" });
  } else {
    next(err);
  }
});
app.use((req, res, next) => {
  res.status(404).send({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err, "<<< you haven't handled this error yet");
  res.status(500).send({ error: "Internal Server Error" });
});

module.exports = app;
