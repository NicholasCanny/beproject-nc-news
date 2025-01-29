const {
  fetchTopics,
  fetchArticleByArticleID,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
  changeArticle,
  removeCommentById,
} = require("./model");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleByArticleID(article_id)
    .then((article) => {
      response.status(200).send({ article, article_id });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticleId = (request, response, next) => {
  const { article_id, comment_id } = request.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments, comment_id });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (request, response, next) => {
  const newComment = request.body;

  const { article_id } = request.params;

  addComment(newComment, article_id)
    .then((newComment) => {
      response.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};

const updateArticle = (request, response, next) => {
  const articleChange = request.body;
  const newVote = articleChange.inc_votes;

  const { article_id } = request.params;

  changeArticle(newVote, article_id)
    .then((articleChange) => {
      response.status(201).send({ articleChange });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getTopics,
  getArticleByArticleId,
  getArticles,
  getCommentsByArticleId,
  postComment,
  updateArticle,
  deleteCommentByID,
};
