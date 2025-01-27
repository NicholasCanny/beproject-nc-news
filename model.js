const db = require("./db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticleByArticleID = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id]) // subsitution - $1 == first element in the array
    .then(({ rows }) => {
      if (rows.length === 0) {
        // no results = thats an error
        return Promise.reject({ message: "article not found" });
      } else {
        // results = no error
        return rows[0];
      }
    });
};

const fetchArticles = () => {
  return db.query(`SELECT * FROM articles`).then(({ rows }) => {
    return rows;
  });
};

module.exports = { fetchTopics, fetchArticleByArticleID, fetchArticles };
