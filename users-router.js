const usersRouter = require("express").Router();
const { getUsers, getUserByUserName } = require("./controller");

usersRouter
  .route("/")
  .get(getUsers) // Get all users
  .post((req, res) => {
    res.status(201).send("All OK from POST /api/users");
  });

usersRouter
  .route("/:username")
  .get(getUserByUserName)
  .patch((req, res) => {
    res.status(200).send("All OK from PATCH /api/users/:username");
  });

module.exports = usersRouter;
