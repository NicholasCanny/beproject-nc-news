const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkCategoryExists = (category, category_id) => {
  const validCategories = {
    articles: "article_id",
    comments: "comment_id",
    users: "user_id",
    topics: "topic_id",
  };

  const tableName = category;
  const columnName = validCategories[category];

  if (!validCategories[category]) {
    return Promise.reject({
      status: 400,
      message: `${tableName} not found`,
    });
  }

  const queryString = `SELECT * FROM ${tableName} WHERE ${columnName} = $1`;

  return db.query(queryString, [category_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `${columnName} not found`,
      });
    }
    const singularCategory = category.endsWith("s")
      ? category.slice(0, -1)
      : category;

    return `${singularCategory} exists`;
  });
};

// exports.checkCategoryExists = (category_id) => {
//   return db
//     .query(`SELECT * FROM articles WHERE article_id = $1`, [category_id])
//     .then(({ rows }) => {
//       if (rows.length === 0) {
//         return Promise.reject({
//           status: 404,
//           message: "article ID not found",
//         });
//       }
//       //  Perhaps just return nothing and adjust test?
//       return "article exists";
//     });
// };

// exports.checkCommentExists = (comment_id) => {
//   return db
//     .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
//     .then(({ rows }) => {
//       if (rows.length === 0) {
//         return Promise.reject({
//           status: 404,
//           message: "comment ID not found",
//         });
//       }
//       return "comment exists";
//     });
// };
