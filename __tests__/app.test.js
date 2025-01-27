const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const devData = require("../db/data/development-data/index.js");
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
