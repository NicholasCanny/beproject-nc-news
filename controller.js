const { commentData } = require("./db/data/test-data");
const {
  fetchTopics,
  fetchArticlesWithCommentCount,
  fetchArticleByArticleID,
  fetchCommentsByArticleId,
  addComment,
  changeArticle,
  removeCommentById,
  fetchUsers,
  fetchUserByUserName,
  changeComment,
  addArticle,
  removeArticleById,
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

const getArticlesWithCommentCount = (request, response, next) => {
  const queries = request.query;

  const sort_by = queries.sort_by;
  const order = queries.order;
  const topic = queries.topic;

  fetchArticlesWithCommentCount(sort_by, order, topic)
    .then((articles) => {
      response.status(200).send({ articles });
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

const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserByUserName = (request, response, next) => {
  const { username } = request.params;

  fetchUserByUserName(username)
    .then((user) => {
      response.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

const updateComment = (request, response, next) => {
  const commentChange = request.body;
  const newVote = commentChange.inc_votes;

  const { comment_id } = request.params;

  changeComment(newVote, comment_id)
    .then((commentChange) => {
      response.status(201).send({ commentChange });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticle = (request, response, next) => {
  const newArticle = request.body;

  const { article_id } = request.params;

  addArticle(newArticle)
    .then((newArticle) => {
      response.status(201).send({ article: newArticle });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteArticleByID = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getTopics,
  getArticlesWithCommentCount,
  getArticleByArticleId,
  getCommentsByArticleId,
  postComment,
  updateArticle,
  deleteCommentByID,
  getUsers,
  getUserByUserName,
  updateComment,
  postArticle,
  deleteArticleByID,
};
