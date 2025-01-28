const db = require("./db/connection");
const { checkCategoryExists } = require("./db/seeds/utils");

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

// const fetchCommentsByArticleId = (id) => {
//   return db
//     .query(
//       `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
//       [id]
//     )
//     .then(({ rows, rowCount }) => {
//       if (rowCount === 0) {
//         return Promise.reject({ message: "comments not found" });
//       } else {
//         return rows;
//       }
//     });
// };

const fetchCommentsByArticleId = (id) => {
  return checkCategoryExists(id).then(() => {
    return db
      .query(
        `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
        [id]
      )
      .then(({ rows }) => {
        return rows;
      });
  });
};

const addComment = (newComment, id) => {
  const { body, username } = newComment;

  return checkCategoryExists(id).then(() => {
    return db
      .query(
        `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
        [body, username, id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};

const changeArticle = (newVote, id) => {
  return checkCategoryExists(id).then(() => {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2  RETURNING *`,
        [newVote, id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};

const removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "comment not found",
        });
      }
      return;
    });
};

module.exports = {
  fetchTopics,
  fetchArticleByArticleID,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
  changeArticle,
  removeCommentById,
};
