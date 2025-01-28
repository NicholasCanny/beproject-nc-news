const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { checkCategoryExists } = require("../db/seeds/utils");
require("jest-sorted");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  // this function runs before each test
  return seed(testData);
});

afterAll(() => {
  // this function runs after all the tests are complete
  // we are connected to the database

  return db.end(); // this closes the connection to the database
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("should respond with an array of three topics, with value parameters typeof string", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;

        expect(body.topics.length).toBe(3);

        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api/cheeseOnToast", () => {
  test("should respond with 404 with an invalid endpoint", () => {
    return request(app)
      .get("/api/cheeseOnToast")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({
          error: "Route not found",
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should respond with one article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const body = response.body;
        const article = body.article;

        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String), // As this is time stamped, instead checks that created_at is a string
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("should respond with an error message if article Id doesn't exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({
          error: "article not found",
        });
      });
  });
  test("should respond with bad request if invalid type inputted for Id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
          error: "Bad Request",
        });
      });
  });

  describe("GET /api/articles", () => {
    test("should respond with an array of articles with no body property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const body = response.body;

          expect(body.articles.length).toBe(13);

          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });

          body.articles.forEach((article) => {
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.body).toBe("undefined");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
          });
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("should respond with sorted comments selected by article ID and including comment ID", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const body = response.body;
          const comments = body.comments;

          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });

          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: 1,
              comment_id: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });

    test("should respond with an error message if article ID doesn't exist", () => {
      return request(app)
        .get("/api/articles/100/comments")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ error: "article ID not found" });
        });
    });

    test("should respond with bad request if invalid type inputted for ID", () => {
      return request(app)
        .get("/api/articles/pug/comments")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ error: "Bad Request" });
        });
    });
    test("should respond with 200 and empty array of comments if the article ID exists but there are no comments for that article", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ comments: [] });
        });
    });
    test("should resolve if article Id exists ", () => {
      return expect(checkCategoryExists(1)).resolves.toBe("article exists");
    });
  });
  test("should reject if category ID doesn't exist", () => {
    return expect(checkCategoryExists(100)).rejects.toMatchObject({
      status: 404,
      message: "article ID not found",
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("should respond with a posted comment to specific article ID", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "lurker",
          body: "pugs not drugs",
        })
        .expect(201)
        .then((response) => {
          const postedComment = response.body.comment;
          expect(postedComment).toMatchObject({
            comment_id: expect.any(Number),
            body: "pugs not drugs",
            article_id: 1,
            author: "lurker",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test("should respond with a posted comment to specific article ID", () => {
      return request(app)
        .post("/api/articles/100/comments")
        .send({
          username: "lurker",
          body: "pugs not drugs",
        })
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ error: "article ID not found" });
        });
    });
  });
  test("should respond with a posted comment to specific article ID", () => {
    return request(app)
      .post("/api/articles/pug/comments")
      .send({
        username: "lurker",
        body: "pugs not drugs",
      })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ error: "Bad Request" });
      });
  });
});
