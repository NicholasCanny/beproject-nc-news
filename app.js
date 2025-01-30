const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
// imported endpoints.json

const {
  getTopics,
  getArticleByArticleId,
  getArticles,
  getCommentsByArticleId,
  postComment,
  updateArticle,
  deleteCommentByID,
  getUsers,
  getArticlesWithCommentCount,
} = require("./controller");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByArticleId);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticle);

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticlesWithCommentCount);

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
