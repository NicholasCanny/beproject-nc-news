// routes/api-router.js
const express = require("express");
const apiRouter = express.Router();
const usersRouter = require("./users-router.js");

const {
  getTopics,
  getArticlesWithCommentCount,
  getArticleByArticleId,
  getCommentsByArticleId,
  postComment,
  updateArticle,
  deleteCommentByID,
  updateComment,
} = require("./controller");

apiRouter.get("/topics", getTopics);
apiRouter.get("/articles", getArticlesWithCommentCount);
apiRouter.get("/articles/:article_id", getArticleByArticleId);
apiRouter.get("/articles/:article_id/comments", getCommentsByArticleId);
apiRouter.post("/articles/:article_id/comments", postComment);
apiRouter.patch("/articles/:article_id", updateArticle);
apiRouter.patch("/comments/:comment_id", updateComment);
apiRouter.delete("/comments/:comment_id", deleteCommentByID);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
