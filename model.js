const db = require("./db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticleByArticleID = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ message: "article not found" });
      } else {
        return rows[0];
      }
    });
};

const fetchArticles = () => {
  return db
    .query(
      `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Route not found" });
      } else {
        return rows;
      }
    });
};

const fetchCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
      [id]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ message: "comments not found" });
      } else {
        return rows;
      }
    });
};

module.exports = {
  fetchTopics,
  fetchArticleByArticleID,
  fetchArticles,
  fetchCommentsByArticleId,
};
