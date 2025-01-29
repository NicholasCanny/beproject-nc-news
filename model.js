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
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "comment not found",
        });
      }
      return;
    });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticlesWithQuery = (sort_by, order, validColumnNamesToSortBy) => {
  let SQLString = `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles`; // Start with a basic string
  const args = [];

  // I tried passing sort_by and query as default arguments e.g. sort_by="created_at",
  // but I couldn't override these for some reason, so did these if statements instead.

  if (!sort_by) {
    sort_by = "created_at";
  }

  if (!order) {
    order = "desc";
  }

  // // conditionally build up your string and arguments
  // if (category_id) {
  //   SQLString += " WHERE category_id = $1"; // dollar syntax only works for VALUES
  //   args.push(category_id);
  // }

  if (sort_by) {
    if (validColumnNamesToSortBy.includes(sort_by)) {
      SQLString += ` ORDER BY ${sort_by}`;
    }

    if (order === "desc" || order === "asc") {
      SQLString += " " + order;
    }
  }

  console.log(SQLString, "<<<<<<< Thats my query");

  return db.query(SQLString).then(({ rows }) => {
    // if (rows.length === 0) {
    //   return Promise.reject({ message: "Route not found" });
    // } else {
    return rows;
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
  fetchUsers,
  fetchArticlesWithQuery,
};
