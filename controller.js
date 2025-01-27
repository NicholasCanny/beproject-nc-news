const { fetchTopics, fetchArticleByArticleID } = require("./model");

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
      response.status(200).send({ article: article });
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

module.exports = { getTopics, getArticleByArticleId, getArticles };
