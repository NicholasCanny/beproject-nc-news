const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");

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
});
