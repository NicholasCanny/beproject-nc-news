const db = require("./db/connection");
const {
  checkCategoryExists,
  checkCategoryExists2,
} = require("./db/seeds/utils");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticlesWithCommentCount = (sort_by, order, topic) => {
  const validColumnNamesToSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrder = ["asc", "desc"];

  return db.query(`SELECT slug FROM topics`).then(({ rows }) => {
    const validTopics = rows.map((row) => row.slug);

    if (
      (sort_by && !validColumnNamesToSortBy.includes(sort_by)) ||
      (order && !validOrder.includes(order)) ||
      (topic && !validTopics.includes(topic))
    ) {
      return Promise.reject({
        status: 400,
        message: "bad request",
      });
    }

    let SQLString = `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles`;
    const args = [];

    if (topic) {
      SQLString += " WHERE topic = $1";
      args.push(topic);
    }

    sort_by = sort_by || "created_at";
    order = order || "desc";

    SQLString += ` ORDER BY ${sort_by} ${order}`;

    return db.query(SQLString, args).then(({ rows }) => {
      return rows;
    });
  });
};

const fetchArticleByArticleID = (id) => {
  return Promise.all([
    db.query(`SELECT * FROM articles WHERE article_id=$1`, [id]),
    db.query(`SELECT * FROM comments WHERE article_id=$1`, [id]),
  ]).then(([articleRows, commentRows]) => {
    const commentCount = commentRows.rows.length;
    if (articleRows.rowCount === 0) {
      return Promise.reject({ status: 404, message: "article not found" });
    } else {
      articleRows.rows[0].comment_count = commentCount;

      return articleRows.rows[0];
    }
  });
};

const fetchCommentsByArticleId = (id) => {
  return checkCategoryExists("articles", id).then(() => {
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

  return checkCategoryExists("articles", id).then(() => {
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
  return checkCategoryExists("articles", id).then(() => {
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

const fetchUserByUserName = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "user not found",
        });
      }
      return rows[0];
    });
};

const changeComment = (newVote, id) => {
  return checkCategoryExists("comments", id).then(() => {
    return db
      .query(
        `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2  RETURNING *`,
        [newVote, id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};

module.exports = {
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
};
