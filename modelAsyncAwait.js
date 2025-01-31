const db = require("./db/connection");
const {
  checkCategoryExists,
  checkCategoryExists2,
} = require("./db/seeds/utils");

const fetchTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics`);
  return rows;
};

const fetchArticlesWithCommentCount = async (sort_by, order, topic) => {
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

  const { rows } = await db.query(`SELECT slug FROM topics`);
  const validTopics = rows.map((row) => row.slug);

  if (
    (sort_by && !validColumnNamesToSortBy.includes(sort_by)) ||
    (order && !validOrder.includes(order)) ||
    (topic && !validTopics.includes(topic))
  ) {
    throw { status: 400, message: "bad request" };
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

  const result = await db.query(SQLString, args);
  return result.rows;
};

const fetchArticleByArticleID = async (id) => {
  const [articleRows, commentRows] = await Promise.all([
    db.query(`SELECT * FROM articles WHERE article_id=$1`, [id]),
    db.query(`SELECT * FROM comments WHERE article_id=$1`, [id]),
  ]);

  const commentCount = commentRows.rows.length;
  if (articleRows.rowCount === 0) {
    throw { status: 404, message: "article not found" };
  }

  articleRows.rows[0].comment_count = commentCount;
  return articleRows.rows[0];
};

const fetchCommentsByArticleId = async (id) => {
  await checkCategoryExists("articles", id);
  const { rows } = await db.query(
    `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
    [id]
  );
  return rows;
};

const addComment = async (newComment, id) => {
  const { body, username } = newComment;
  await checkCategoryExists("articles", id);

  const { rows } = await db.query(
    `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
    [body, username, id]
  );
  return rows[0];
};

const changeArticle = async (newVote, id) => {
  await checkCategoryExists("articles", id);

  const { rows } = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2  RETURNING *`,
    [newVote, id]
  );
  return rows[0];
};

const removeCommentById = async (comment_id) => {
  const { rowCount } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1;",
    [comment_id]
  );

  if (rowCount === 0) {
    throw { status: 404, message: "comment not found" };
  }
};

const fetchUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};

const fetchUserByUserName = async (username) => {
  const { rows, rowCount } = await db.query(
    `SELECT * FROM users WHERE username=$1`,
    [username]
  );

  if (rowCount === 0) {
    throw { status: 404, message: "user not found" };
  }

  return rows[0];
};

const changeComment = async (newVote, id) => {
  await checkCategoryExists("comments", id);

  const { rows } = await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2  RETURNING *`,
    [newVote, id]
  );
  return rows[0];
};

const addArticle = async (newArticle) => {
  let { author, title, body, topic, article_img_url } = newArticle;

  const { rows } = await db.query(`SELECT username FROM users`);
  const validAuthors = rows.map((row) => row.username);

  if (!validAuthors.includes(author)) {
    throw { status: 400, message: "author not found" };
  }

  article_img_url =
    article_img_url ||
    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700";

  const { rows: articleRows } = await db.query(
    `INSERT INTO articles (author, title, body, topic, article_img_url) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
    [author, title, body, topic, article_img_url]
  );

  if (articleRows.length === 0) {
    throw { status: 404, message: "article not found" };
  }

  const article = articleRows[0];

  const { rows: commentCountRows } = await db.query(
    `SELECT COUNT(*) FROM comments WHERE author = $1`,
    [author]
  );
  article.comment_count = Number(commentCountRows[0].count);

  return article;
};

const removeArticleById = async (article_id) => {
  const [commentResult, articleResult] = await Promise.all([
    db.query("DELETE FROM comments WHERE article_id = $1", [article_id]),
    db.query("DELETE FROM articles WHERE article_id = $1", [article_id]),
  ]);

  if (articleResult.rowCount === 0) {
    throw { status: 404, message: "article not found" };
  }
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
  addArticle,
  removeArticleById,
};
