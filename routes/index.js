const pool = require("../database/index.js");
const express = require("express");
const { generateRandomID } = require("../utils/index.js");
const router = express.Router();

const TODO_BASE_PATH = "/todos";

router.get(TODO_BASE_PATH, (req, response) => {
  pool
    .query(`SELECT task AS "title", is_done AS "completed" FROM todo;`)
    .then((res) => response.json({ todos: res.rows }))
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ message: err.stack });
    });
});

router.post(TODO_BASE_PATH, (req, response) => {
  const { task, isDone } = req.body;
  const query = {
    text: "INSERT INTO todo (task, is_done) VALUES ($1, $2) RETURNING *",
    values: [task, isDone],
  };

  pool
    .query(query)
    .then((res) => response.json({ todo: res.rows[0] }))
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ message: err.stack });
    });
});

router.get("/user", (req, response) => {
  const query = { text: "SELECT * FROM users" };
  pool
    .query(query)
    .then((res) => response.json({ users: res.rows }))
    .catch((err) => console.log(err.stack));
});

router.post("/user", (req, response) => {
  const { username, password, role = "user" } = req.body;
  const query = {
    text: "INSERT INTO users (id, username, password, role, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    values: [generateRandomID(), username, password, role, new Date()],
  };
  pool
    .query(query)
    .then((res) => {
      response.json({ user: res.rows[0] });
    })
    .catch((err) => {
      console.log(err.stack);
    });
});

module.exports = router;
